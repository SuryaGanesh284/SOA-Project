package com.archivalia.ai.client;

import com.archivalia.ai.config.GeminiConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class GeminiApiClient {

    private static final Logger log = LoggerFactory.getLogger(GeminiApiClient.class);

    private final RestClient restClient;
    private final GeminiConfig config;
    private final ObjectMapper objectMapper;

    public GeminiApiClient(RestClient geminiRestClient, GeminiConfig config, ObjectMapper objectMapper) {
        this.restClient = geminiRestClient;
        this.config = config;
        this.objectMapper = objectMapper;
    }

    public record GenerateResult(
            String content,
            String modelUsed,
            boolean fallbackUsed,
            int promptTokens,
            int candidateTokens,
            boolean success
    ) {}

    public GenerateResult generateText(String prompt) {
        return generate(prompt, false, null);
    }

    public GenerateResult generateJson(String prompt) {
        return generate(prompt, true, null);
    }

    public GenerateResult generateWithSystemInstruction(String systemInstruction, String userPrompt, boolean jsonMode) {
        return generate(userPrompt, jsonMode, systemInstruction);
    }

    private GenerateResult generate(String prompt, boolean jsonMode, String systemInstruction) {
        // Try Primary Model
        try {
            log.info("Dispatching prompt to primary Gemini model: {}", config.getModel());
            return executeCall(config.getModel(), prompt, jsonMode, systemInstruction, false);
        } catch (Exception ex) {
            log.warn("Primary model {} call failed: {}. Attempting fallback model: {}",
                    config.getModel(), ex.getMessage(), config.getFallbackModel());
            // Try Fallback Model
            try {
                return executeCall(config.getFallbackModel(), prompt, jsonMode, systemInstruction, true);
            } catch (Exception fallbackEx) {
                log.error("Fallback model {} also failed: {}", config.getFallbackModel(), fallbackEx.getMessage());
                return new GenerateResult(
                        "Unable to complete AI generation at this moment due to upstream API unavailability: " + fallbackEx.getMessage(),
                        config.getFallbackModel(),
                        true,
                        0,
                        0,
                        false
                );
            }
        }
    }

    private GenerateResult executeCall(String model, String prompt, boolean jsonMode, String systemInstruction, boolean isFallback) {
        String url = String.format("%s/%s:generateContent", config.getBaseUrl(), model);

        Map<String, Object> body = new HashMap<>();

        if (systemInstruction != null && !systemInstruction.isBlank()) {
            body.put("systemInstruction", Map.of(
                    "parts", List.of(Map.of("text", systemInstruction))
            ));
        }

        body.put("contents", List.of(
                Map.of(
                        "role", "user",
                        "parts", List.of(Map.of("text", prompt))
                )
        ));

        Map<String, Object> genConfig = new HashMap<>();
        genConfig.put("temperature", 0.4);
        genConfig.put("topP", 0.95);
        genConfig.put("maxOutputTokens", 2048);
        if (jsonMode) {
            genConfig.put("responseMimeType", "application/json");
        }
        body.put("generationConfig", genConfig);

        String rawJson = restClient.post()
                .uri(url)
                .header("x-goog-api-key", config.getApiKey())
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(String.class);

        return parseResponse(rawJson, model, isFallback);
    }

    private GenerateResult parseResponse(String rawJson, String model, boolean isFallback) {
        try {
            JsonNode root = objectMapper.readTree(rawJson);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                JsonNode parts = candidates.get(0).path("content").path("parts");
                if (parts.isArray() && !parts.isEmpty()) {
                    String text = parts.get(0).path("text").asText("");
                    
                    int promptTokens = root.path("usageMetadata").path("promptTokenCount").asInt(0);
                    int candidateTokens = root.path("usageMetadata").path("candidatesTokenCount").asInt(0);

                    return new GenerateResult(text, model, isFallback, promptTokens, candidateTokens, true);
                }
            }
            throw new RuntimeException("No candidates content found in Gemini API response");
        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", e.getMessage());
            throw new RuntimeException("Error parsing Gemini API response: " + e.getMessage(), e);
        }
    }
}
