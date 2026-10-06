package com.archivalia.ai.controller;

import com.archivalia.ai.client.GeminiApiClient;
import com.archivalia.ai.config.GeminiConfig;
import com.archivalia.ai.dto.AiTestRequest;
import com.archivalia.ai.dto.AiTestResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@CrossOrigin(origins = "*")
public class AiController {

    private final GeminiApiClient geminiApiClient;
    private final GeminiConfig geminiConfig;

    public AiController(GeminiApiClient geminiApiClient, GeminiConfig geminiConfig) {
        this.geminiApiClient = geminiApiClient;
        this.geminiConfig = geminiConfig;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "service", "ai-service",
                "status", "UP",
                "port", 8088,
                "configuredModel", geminiConfig.getModel(),
                "fallbackModel", geminiConfig.getFallbackModel(),
                "apiKeyConfigured", geminiConfig.getApiKey() != null && !geminiConfig.getApiKey().isBlank()
        ));
    }

    @PostMapping("/test-generate")
    public ResponseEntity<AiTestResponse> testGenerate(@Valid @RequestBody AiTestRequest request) {
        GeminiApiClient.GenerateResult result;
        if (request.isJsonMode()) {
            result = geminiApiClient.generateJson(request.getPrompt());
        } else {
            result = geminiApiClient.generateText(request.getPrompt());
        }

        AiTestResponse response = new AiTestResponse(
                result.success(),
                result.content(),
                result.modelUsed(),
                result.fallbackUsed(),
                result.promptTokens(),
                result.candidateTokens()
        );

        return ResponseEntity.ok(response);
    }
}
