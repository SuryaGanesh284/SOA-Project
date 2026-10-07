package com.archivalia.ai.controller;

import com.archivalia.ai.client.GeminiApiClient;
import com.archivalia.ai.config.GeminiConfig;
import com.archivalia.ai.dto.*;
import com.archivalia.ai.service.AcademicResearchService;
import com.archivalia.ai.service.BookSynopsisService;
import com.archivalia.ai.service.SemanticSearchService;
import com.archivalia.ai.service.StudyPackService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@CrossOrigin(origins = "*")
public class AiController {

    private final GeminiApiClient geminiApiClient;
    private final GeminiConfig geminiConfig;
    private final AcademicResearchService researchService;
    private final SemanticSearchService semanticSearchService;
    private final BookSynopsisService synopsisService;
    private final StudyPackService studyPackService;

    public AiController(
            GeminiApiClient geminiApiClient,
            GeminiConfig geminiConfig,
            AcademicResearchService researchService,
            SemanticSearchService semanticSearchService,
            BookSynopsisService synopsisService,
            StudyPackService studyPackService) {
        this.geminiApiClient = geminiApiClient;
        this.geminiConfig = geminiConfig;
        this.researchService = researchService;
        this.semanticSearchService = semanticSearchService;
        this.synopsisService = synopsisService;
        this.studyPackService = studyPackService;
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

    // --- Feature 1: Academic Research Assistant ---

    @PostMapping("/research-assist")
    public ResponseEntity<ResearchAssistResponse> researchAssist(@Valid @RequestBody ResearchAssistRequest request) {
        ResearchAssistResponse response = researchService.solveProblem(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/research-assist/history")
    public ResponseEntity<List<ResearchAssistResponse>> getResearchHistory(
            @RequestParam(required = false) String userId) {
        List<ResearchAssistResponse> history = researchService.getUserHistory(userId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/research-assist/{id}")
    public ResponseEntity<ResearchAssistResponse> getResearchSession(@PathVariable Long id) {
        ResearchAssistResponse response = researchService.getSessionById(id);
        return ResponseEntity.ok(response);
    }

    // --- Feature 2: Deep Semantic Book Search & Synopsis Engine ---

    @PostMapping("/semantic-search")
    public ResponseEntity<SemanticSearchResponse> semanticSearch(@Valid @RequestBody SemanticSearchRequest request) {
        SemanticSearchResponse response = semanticSearchService.search(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/synopsis")
    public ResponseEntity<BookSynopsisResponse> generateSynopsis(@Valid @RequestBody BookSynopsisRequest request) {
        BookSynopsisResponse response = synopsisService.generateOrGetSynopsis(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/synopsis/{identifier}")
    public ResponseEntity<BookSynopsisResponse> getSynopsisByIdentifier(@PathVariable String identifier) {
        return synopsisService.getSynopsisByIdentifier(identifier)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Feature 3: Dynamic Study Pack & Interactive Quiz Generator ---

    @PostMapping("/study-pack")
    public ResponseEntity<StudyPackResponse> generateStudyPack(@Valid @RequestBody StudyPackRequest request) {
        StudyPackResponse response = studyPackService.generateOrGetStudyPack(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/study-pack/{id}")
    public ResponseEntity<StudyPackResponse> getStudyPackById(@PathVariable Long id) {
        return studyPackService.getStudyPackById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/study-pack/by-isbn/{isbn}")
    public ResponseEntity<StudyPackResponse> getStudyPackByIsbn(@PathVariable String isbn) {
        return studyPackService.getStudyPackByIsbn(isbn)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/study-pack/evaluate")
    public ResponseEntity<QuizEvaluationResponse> evaluateQuiz(@Valid @RequestBody QuizSubmitRequest request) {
        QuizEvaluationResponse response = studyPackService.evaluateQuiz(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/study-pack/recent")
    public ResponseEntity<List<StudyPackResponse>> getRecentStudyPacks() {
        List<StudyPackResponse> recent = studyPackService.getRecentStudyPacks();
        return ResponseEntity.ok(recent);
    }
}
