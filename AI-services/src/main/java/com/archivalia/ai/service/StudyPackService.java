package com.archivalia.ai.service;

import com.archivalia.ai.client.GeminiApiClient;
import com.archivalia.ai.dto.*;
import com.archivalia.ai.entity.StudyPack;
import com.archivalia.ai.repository.StudyPackRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class StudyPackService {

    private static final Logger log = LoggerFactory.getLogger(StudyPackService.class);
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final GeminiApiClient geminiApiClient;
    private final StudyPackRepository repository;
    private final ObjectMapper objectMapper;

    private static final String SYSTEM_INSTRUCTION = """
            You are Archivalia's Master Academic Professor, Curriculum Designer, and Examination Board Evaluator.
            Given a textbook/academic work, an optional topic focus, and a target academic difficulty level,
            produce a comprehensive, rigorous Study Pack with high-yield principles, key mathematical/algorithmic models,
            foundation prerequisites, real-world industry case studies, and a 5-question interactive revision quiz.
            
            Return strictly a single valid JSON object adhering to this schema:
            {
              "executiveSummary": "Deep, 2-3 paragraph academic synthesis of the text's thesis, conceptual architecture, and foundational significance.",
              "highYieldPrinciples": [
                "Detailed Principle 1: Formal theorem, invariant, or architectural paradigm",
                "Detailed Principle 2: Mechanism, trade-off, or concurrency/computational model",
                "Detailed Principle 3: Failure modes, edge cases, or asymptotic behaviors",
                "Detailed Principle 4: High-yield exam takeaway / golden rule"
              ],
              "formulaeOrAlgorithms": [
                "Key algorithmic bound or mathematical equation 1 with explanatory annotation",
                "Key algorithmic bound or mathematical equation 2 with explanatory annotation",
                "Key architectural formula or complexity tradeoff 3 with explanatory annotation"
              ],
              "prerequisites": [
                "Foundational prerequisite subject or mathematical topic 1",
                "Foundational prerequisite subject or mathematical topic 2",
                "Foundational prerequisite subject or mathematical topic 3"
              ],
              "realWorldApplications": [
                "Case Study 1: How high-scale production systems or research labs utilize this in practice",
                "Case Study 2: Real-world engineering system architecture implementing these exact concepts",
                "Case Study 3: Practical industry trade-off decision driven by these principles"
              ],
              "quizQuestions": [
                {
                  "questionNumber": 1,
                  "question": "Rigorous academic scenario or conceptual question testing deep comprehension (not trivial trivia)",
                  "options": [
                    "Plausible Option A",
                    "Plausible Option B",
                    "Plausible Option C",
                    "Plausible Option D"
                  ],
                  "correctAnswerIndex": 0,
                  "conceptTested": "Micro-concept or theorem tested",
                  "explanation": "Detailed technical explanation explaining why the correct option is true and why the other options fail under formal analysis."
                }
              ]
            }
            Ensure exactly 5 rigorous quiz questions in 'quizQuestions', each with 4 distinct options and an accurate 0-based correctAnswerIndex (0, 1, 2, or 3).
            Format all mathematical formulas and asymptotic bounds using plain-text notations (e.g. O(V + E), O(N log N), Theta(N^2)) without raw LaTeX backslashes.
            Do not output any markdown code fences or conversational text outside the JSON.
            """;

    public StudyPackService(GeminiApiClient geminiApiClient, StudyPackRepository repository, ObjectMapper objectMapper) {
        this.geminiApiClient = geminiApiClient;
        this.repository = repository;
        this.objectMapper = objectMapper.copy()
                .configure(com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_BACKSLASH_ESCAPING_ANY_CHARACTER, true)
                .configure(com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
    }

    @Transactional
    public StudyPackResponse generateOrGetStudyPack(StudyPackRequest request) {
        String cleanTitle = request.getBookTitle() != null ? request.getBookTitle().trim() : "";
        String cleanIsbn = request.getIsbn() != null ? request.getIsbn().trim() : "";
        String difficulty = (request.getDifficultyLevel() != null && !request.getDifficultyLevel().isBlank())
                ? request.getDifficultyLevel().trim() : "Intermediate";

        // 1. Check Cache unless forceRefresh is true
        if (!request.isForceRefresh()) {
            if (!cleanIsbn.isEmpty()) {
                Optional<StudyPack> byIsbn = repository.findTopByIsbnIgnoreCaseOrderByCreatedAtDesc(cleanIsbn);
                if (byIsbn.isPresent()) {
                    log.info("Returning cached StudyPack for ISBN: {}", cleanIsbn);
                    return toResponse(byIsbn.get(), true);
                }
            }
            if (!cleanTitle.isEmpty()) {
                Optional<StudyPack> byTitle = repository.findTopByBookTitleIgnoreCaseOrderByCreatedAtDesc(cleanTitle);
                if (byTitle.isPresent()) {
                    log.info("Returning cached StudyPack for title: {}", cleanTitle);
                    return toResponse(byTitle.get(), true);
                }
            }
        }

        // 2. Synthesize Study Pack via Gemini
        log.info("Generating dynamic academic Study Pack via Gemini for book: '{}' (Focus: '{}', Level: '{}')",
                cleanTitle, request.getTopicOrExamFocus(), difficulty);

        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("Generate an academic Study Pack and 5-Question Interactive Revision Quiz for:\n");
        promptBuilder.append("- Book Title: ").append(cleanTitle).append("\n");
        if (request.getAuthor() != null && !request.getAuthor().isBlank()) {
            promptBuilder.append("- Author(s): ").append(request.getAuthor().trim()).append("\n");
        }
        if (!cleanIsbn.isEmpty()) {
            promptBuilder.append("- ISBN: ").append(cleanIsbn).append("\n");
        }
        if (request.getTopicOrExamFocus() != null && !request.getTopicOrExamFocus().isBlank()) {
            promptBuilder.append("- Specific Topic / Exam Focus: ").append(request.getTopicOrExamFocus().trim()).append("\n");
        }
        promptBuilder.append("- Academic Difficulty Level: ").append(difficulty).append("\n");
        promptBuilder.append("\nReturn strictly valid JSON according to the schema.");

        GeminiApiClient.GenerateResult result = geminiApiClient.generateJson(promptBuilder.toString(), SYSTEM_INSTRUCTION);

        if (!result.success() || result.content() == null || result.content().isBlank()) {
            log.error("Gemini failed to generate Study Pack for {}: {}", cleanTitle, result.content());
            throw new RuntimeException("AI Generation failed: " + result.content());
        }

        // 3. Parse JSON & Persist Entity
        try {
            String rawJson = sanitizeJson(result.content());
            JsonNode root = objectMapper.readTree(rawJson);

            String executiveSummary = root.path("executiveSummary").asText("No summary provided.");
            String highYieldPrinciplesJson = root.path("highYieldPrinciples").toString();
            String formulaeOrAlgorithmsJson = root.path("formulaeOrAlgorithms").toString();
            String prerequisitesJson = root.path("prerequisites").toString();
            String realWorldApplicationsJson = root.path("realWorldApplications").toString();
            String quizQuestionsJson = root.path("quizQuestions").toString();

            StudyPack entity = new StudyPack(
                    cleanTitle,
                    request.getAuthor(),
                    cleanIsbn,
                    request.getTopicOrExamFocus(),
                    difficulty,
                    executiveSummary,
                    highYieldPrinciplesJson,
                    formulaeOrAlgorithmsJson,
                    prerequisitesJson,
                    realWorldApplicationsJson,
                    quizQuestionsJson,
                    result.modelUsed()
            );

            StudyPack saved = repository.save(entity);
            log.info("Successfully persisted StudyPack with ID: {} for '{}'", saved.getId(), cleanTitle);
            return toResponse(saved, false);

        } catch (Exception ex) {
            log.error("Failed to parse Gemini response for study pack: {}", ex.getMessage(), ex);
            throw new RuntimeException("Failed to parse AI study pack response: " + ex.getMessage(), ex);
        }
    }

    @Transactional(readOnly = true)
    public QuizEvaluationResponse evaluateQuiz(QuizSubmitRequest submitRequest) {
        if (submitRequest.getStudyPackId() == null) {
            throw new IllegalArgumentException("Study pack ID cannot be null");
        }

        StudyPack studyPack = repository.findById(submitRequest.getStudyPackId())
                .orElseThrow(() -> new IllegalArgumentException("Study pack not found with ID: " + submitRequest.getStudyPackId()));

        List<QuizQuestionDto> questions = parseQuizQuestions(studyPack.getQuizQuestionsJson());
        Map<Integer, Integer> userAnswers = submitRequest.getAnswers() != null ? submitRequest.getAnswers() : Collections.emptyMap();

        int totalQuestions = questions.size();
        int correctCount = 0;
        List<QuestionEvaluationDetail> details = new ArrayList<>();
        List<String> missedConcepts = new ArrayList<>();

        for (QuizQuestionDto q : questions) {
            Integer userChoice = userAnswers.get(q.getQuestionNumber());
            boolean isCorrect = userChoice != null && userChoice == q.getCorrectAnswerIndex();

            if (isCorrect) {
                correctCount++;
            } else {
                if (q.getConceptTested() != null && !q.getConceptTested().isBlank()) {
                    missedConcepts.add(q.getConceptTested());
                }
            }

            details.add(new QuestionEvaluationDetail(
                    q.getQuestionNumber(),
                    q.getQuestion(),
                    q.getOptions(),
                    userChoice,
                    q.getCorrectAnswerIndex(),
                    isCorrect,
                    q.getExplanation(),
                    q.getConceptTested()
            ));
        }

        double scorePercentage = totalQuestions > 0 ? ((double) correctCount / totalQuestions) * 100.0 : 0.0;
        scorePercentage = Math.round(scorePercentage * 10.0) / 10.0;

        String tier;
        String feedback;

        if (scorePercentage >= 99.0) {
            tier = "Mastery & Academic Distinction (Grade: A+)";
            feedback = "Flawless demonstration of theoretical principles and systems design concepts! You demonstrated complete conceptual mastery across all tested scenarios.";
        } else if (scorePercentage >= 80.0) {
            tier = "High Academic Proficiency (Grade: A)";
            feedback = "Excellent conceptual foundation. You solved complex theoretical tradeoffs accurately. Review the targeted explanation for the single missed concept to achieve complete mastery.";
        } else if (scorePercentage >= 60.0) {
            tier = "Foundational Competence (Grade: B)";
            feedback = "Solid baseline understanding of the core architecture. We recommend reviewing: " +
                    String.join(", ", missedConcepts) + " before attempting advanced recitations.";
        } else {
            tier = "Targeted Revision Recommended";
            feedback = "Key theoretical nuances require closer study. Examine the high-yield principles and detailed explanations below to reinforce: " +
                    String.join(", ", missedConcepts) + ".";
        }

        return new QuizEvaluationResponse(
                studyPack.getId(),
                totalQuestions,
                correctCount,
                scorePercentage,
                tier,
                feedback,
                details
        );
    }

    @Transactional(readOnly = true)
    public Optional<StudyPackResponse> getStudyPackById(Long id) {
        return repository.findById(id).map(e -> toResponse(e, true));
    }

    @Transactional(readOnly = true)
    public Optional<StudyPackResponse> getStudyPackByIsbn(String isbn) {
        return repository.findTopByIsbnIgnoreCaseOrderByCreatedAtDesc(isbn.trim())
                .map(e -> toResponse(e, true));
    }

    @Transactional(readOnly = true)
    public List<StudyPackResponse> getRecentStudyPacks() {
        return repository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(e -> toResponse(e, true))
                .toList();
    }

    // Helper conversion
    private StudyPackResponse toResponse(StudyPack entity, boolean cached) {
        List<String> principles = parseStringList(entity.getHighYieldPrinciplesJson());
        List<String> formulae = parseStringList(entity.getFormulaeOrAlgorithmsJson());
        List<String> prerequisites = parseStringList(entity.getPrerequisitesJson());
        List<String> realWorld = parseStringList(entity.getRealWorldApplicationsJson());
        List<QuizQuestionDto> questions = parseQuizQuestions(entity.getQuizQuestionsJson());

        String generatedAt = entity.getCreatedAt() != null ? entity.getCreatedAt().format(FORMATTER) : "Recently";

        return new StudyPackResponse(
                entity.getId(),
                entity.getIsbn(),
                entity.getBookTitle(),
                entity.getAuthor(),
                entity.getTopicOrExamFocus(),
                entity.getDifficultyLevel(),
                entity.getExecutiveSummary(),
                principles,
                formulae,
                prerequisites,
                realWorld,
                questions,
                entity.getModelUsed(),
                cached,
                generatedAt
        );
    }

    private List<String> parseStringList(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            log.warn("Failed to parse string list JSON: {}", json);
            return Collections.emptyList();
        }
    }

    private List<QuizQuestionDto> parseQuizQuestions(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try {
            return objectMapper.readValue(json, new TypeReference<List<QuizQuestionDto>>() {});
        } catch (Exception e) {
            log.warn("Failed to parse quiz questions JSON: {}", json);
            return Collections.emptyList();
        }
    }

    private String sanitizeJson(String content) {
        String trimmed = content.trim();
        if (trimmed.startsWith("```json")) {
            trimmed = trimmed.substring(7);
        } else if (trimmed.startsWith("```")) {
            trimmed = trimmed.substring(3);
        }
        if (trimmed.endsWith("```")) {
            trimmed = trimmed.substring(0, trimmed.length() - 3);
        }
        String clean = trimmed.trim();
        // Replace single backslashes that are not followed by valid JSON escape characters with double backslashes
        clean = clean.replaceAll("(?<!\\\\)\\\\(?![\"\\\\/bfnrt]|u[0-9a-fA-F]{4})", "\\\\\\\\");
        return clean;
    }
}
