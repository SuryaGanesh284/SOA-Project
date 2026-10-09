package com.archivalia.ai.service;

import com.archivalia.ai.client.GeminiApiClient;
import com.archivalia.ai.dto.ResearchAssistRequest;
import com.archivalia.ai.dto.ResearchAssistResponse;
import com.archivalia.ai.entity.ResearchSession;
import com.archivalia.ai.repository.ResearchSessionRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class AcademicResearchService {

    private static final Logger log = LoggerFactory.getLogger(AcademicResearchService.class);

    private final GeminiApiClient geminiApiClient;
    private final ResearchSessionRepository repository;
    private final ObjectMapper objectMapper;

    private static final String SYSTEM_INSTRUCTION = """
            You are Archivalia's Senior Academic Research Advisor and University Professor.
            Your mission is to provide rigorous, clear, mathematically sound, and pedagogically authoritative solutions to academic problems across STEM, humanities, and engineering.
            You must format your response strictly as a single valid JSON object adhering to the following schema:
            {
              "executiveSummary": "Concise high-level summary of the problem and core theoretical answer.",
              "stepByStepSolution": "Detailed step-by-step analytical or mathematical breakdown with markdown equations, proofs, or algorithmic steps.",
              "mathematicalFormulations": ["Array of key formulas/theorems used in standard notation or LaTeX (e.g. \\\\nabla L = ...)"],
              "realWorldApplications": "Concrete practical application in industry, engineering, or scientific research.",
              "recommendedTextbooks": ["List of 2 to 4 authoritative academic textbooks and seminal papers (e.g., 'Introduction to Algorithms (CLRS)', 'Deep Learning by Goodfellow et al.')"],
              "recommendedSearchKeywords": ["Array of 3 to 5 targeted keywords to query in the Archivalia E-Library catalog"],
              "followUpResearchQuestions": ["Array of 3 thought-provoking follow-up questions for deeper research"]
            }
            Do not include any text before or after the JSON. Return only the JSON object.
            """;

    public AcademicResearchService(GeminiApiClient geminiApiClient, ResearchSessionRepository repository, ObjectMapper objectMapper) {
        this.geminiApiClient = geminiApiClient;
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public ResearchAssistResponse solveProblem(ResearchAssistRequest request) {
        String userPrompt = String.format("""
                ACADEMIC FIELD: %s
                DIFFICULTY LEVEL: %s
                PROBLEM / RESEARCH QUESTION:
                %s
                """, request.getAcademicField(), request.getDifficultyLevel(), request.getQuery());

        log.info("Generating academic research assistance for topic: {} [{}]", request.getQuery(), request.getAcademicField());

        GeminiApiClient.GenerateResult geminiResult = geminiApiClient.generateWithSystemInstruction(
                SYSTEM_INSTRUCTION, userPrompt, true);

        ResearchAssistResponse response = new ResearchAssistResponse();
        response.setQuery(request.getQuery());
        response.setAcademicField(request.getAcademicField());
        response.setDifficultyLevel(request.getDifficultyLevel());
        response.setModelUsed(geminiResult.modelUsed());
        response.setPromptTokens(geminiResult.promptTokens());
        response.setCandidateTokens(geminiResult.candidateTokens());

        ResearchSession session = new ResearchSession();
        session.setUserId(request.getUserId());
        session.setQuery(request.getQuery());
        session.setAcademicField(request.getAcademicField());
        session.setDifficultyLevel(request.getDifficultyLevel());
        session.setModelUsed(geminiResult.modelUsed());
        session.setPromptTokens(geminiResult.promptTokens());
        session.setCandidateTokens(geminiResult.candidateTokens());

        try {
            JsonNode root = objectMapper.readTree(geminiResult.content());
            response.setExecutiveSummary(root.path("executiveSummary").asText(""));
            response.setStepByStepSolution(extractStepByStepSolution(root.path("stepByStepSolution")));
            response.setRealWorldApplications(root.path("realWorldApplications").asText(""));

            List<String> mathFormulations = parseStringArray(root.path("mathematicalFormulations"));
            List<String> textbooks = parseStringArray(root.path("recommendedTextbooks"));
            List<String> keywords = parseStringArray(root.path("recommendedSearchKeywords"));
            List<String> followUps = parseStringArray(root.path("followUpResearchQuestions"));

            response.setMathematicalFormulations(mathFormulations);
            response.setRecommendedTextbooks(textbooks);
            response.setRecommendedSearchKeywords(keywords);
            response.setFollowUpResearchQuestions(followUps);

            session.setExecutiveSummary(response.getExecutiveSummary());
            session.setStepByStepSolution(response.getStepByStepSolution());
            session.setRealWorldApplications(response.getRealWorldApplications());
            session.setMathematicalFormulations(objectMapper.writeValueAsString(mathFormulations));
            session.setRecommendedTextbooks(objectMapper.writeValueAsString(textbooks));
            session.setRecommendedSearchKeywords(objectMapper.writeValueAsString(keywords));
            session.setFollowUpResearchQuestions(objectMapper.writeValueAsString(followUps));

        } catch (Exception e) {
            log.warn("Failed to parse structured JSON from Gemini response, applying fallback mapping: {}", e.getMessage());
            response.setExecutiveSummary("Direct Academic Analysis");
            response.setStepByStepSolution(geminiResult.content());
            response.setRealWorldApplications("Applicable across academic problem solving and engineering domain research.");
            response.setMathematicalFormulations(List.of());
            response.setRecommendedTextbooks(List.of("Reference primary subject syllabus and literature catalog"));
            response.setRecommendedSearchKeywords(List.of(request.getAcademicField(), "academic literature"));
            response.setFollowUpResearchQuestions(List.of("How can this formulation be extended to non-linear systems?"));

            session.setExecutiveSummary(response.getExecutiveSummary());
            session.setStepByStepSolution(response.getStepByStepSolution());
            session.setRealWorldApplications(response.getRealWorldApplications());
            session.setMathematicalFormulations("[]");
            session.setRecommendedTextbooks("[]");
            session.setRecommendedSearchKeywords("[]");
            session.setFollowUpResearchQuestions("[]");
        }

        ResearchSession saved = repository.save(session);
        response.setId(saved.getId());
        response.setCreatedAt(saved.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        return response;
    }

    public List<ResearchAssistResponse> getUserHistory(String userId) {
        List<ResearchSession> sessions;
        if (userId != null && !userId.isBlank()) {
            sessions = repository.findByUserIdOrderByCreatedAtDesc(userId);
        } else {
            sessions = repository.findAllByOrderByCreatedAtDesc();
        }
        return sessions.stream().map(this::mapToResponse).toList();
    }

    public ResearchAssistResponse getSessionById(Long id) {
        ResearchSession session = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Research session not found with ID: " + id));
        return mapToResponse(session);
    }

    private ResearchAssistResponse mapToResponse(ResearchSession session) {
        ResearchAssistResponse response = new ResearchAssistResponse();
        response.setId(session.getId());
        response.setQuery(session.getQuery());
        response.setAcademicField(session.getAcademicField());
        response.setDifficultyLevel(session.getDifficultyLevel());
        response.setExecutiveSummary(session.getExecutiveSummary());
        response.setStepByStepSolution(session.getStepByStepSolution());
        response.setRealWorldApplications(session.getRealWorldApplications());
        response.setModelUsed(session.getModelUsed());
        response.setPromptTokens(session.getPromptTokens());
        response.setCandidateTokens(session.getCandidateTokens());
        response.setCreatedAt(session.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        response.setMathematicalFormulations(deserializeList(session.getMathematicalFormulations()));
        response.setRecommendedTextbooks(deserializeList(session.getRecommendedTextbooks()));
        response.setRecommendedSearchKeywords(deserializeList(session.getRecommendedSearchKeywords()));
        response.setFollowUpResearchQuestions(deserializeList(session.getFollowUpResearchQuestions()));

        return response;
    }

    private String extractStepByStepSolution(JsonNode node) {
        if (node == null || node.isMissingNode() || node.isNull()) {
            return "";
        }
        if (node.isTextual()) {
            return node.asText();
        } else if (node.isArray()) {
            StringBuilder sb = new StringBuilder();
            for (JsonNode item : node) {
                if (item.isTextual()) {
                    sb.append("* ").append(item.asText()).append("\n\n");
                } else if (item.isObject()) {
                    String title = item.path("title").asText(item.path("step").asText(""));
                    String desc = item.path("description").asText(item.path("details").asText(""));
                    int num = item.path("stepNumber").asInt(0);
                    if (num > 0) {
                        sb.append("### Step ").append(num).append(": ").append(title).append("\n");
                    } else if (!title.isBlank()) {
                        sb.append("### ").append(title).append("\n");
                    }
                    if (!desc.isBlank()) {
                        sb.append(desc).append("\n\n");
                    }
                }
            }
            return sb.toString().trim();
        } else if (node.isObject()) {
            return node.toPrettyString();
        }
        return node.asText("");
    }

    private List<String> parseStringArray(JsonNode node) {
        List<String> list = new ArrayList<>();
        if (node != null && node.isArray()) {
            for (JsonNode item : node) {
                if (item.isTextual()) {
                    list.add(item.asText());
                } else if (item.isObject()) {
                    String title = item.path("title").asText("");
                    String authors = "";
                    JsonNode authorsNode = item.path("authors");
                    if (authorsNode.isArray()) {
                        List<String> aList = new ArrayList<>();
                        for (JsonNode a : authorsNode) aList.add(a.asText());
                        authors = String.join(", ", aList);
                    } else if (authorsNode.isTextual()) {
                        authors = authorsNode.asText();
                    }
                    if (!title.isBlank()) {
                        list.add(authors.isBlank() ? title : title + " (by " + authors + ")");
                    } else {
                        list.add(item.toPrettyString());
                    }
                }
            }
        } else if (node != null && node.isTextual() && !node.asText().isBlank()) {
            list.add(node.asText());
        }
        return list;
    }

    private List<String> deserializeList(String json) {
        if (json == null || json.isBlank()) return List.of();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return List.of(json);
        }
    }
}
