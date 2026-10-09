package com.archivalia.ai.service;

import com.archivalia.ai.client.GeminiApiClient;
import com.archivalia.ai.dto.BookSynopsisRequest;
import com.archivalia.ai.dto.BookSynopsisResponse;
import com.archivalia.ai.entity.BookSynopsis;
import com.archivalia.ai.repository.BookSynopsisRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BookSynopsisService {

    private static final Logger log = LoggerFactory.getLogger(BookSynopsisService.class);

    private final GeminiApiClient geminiApiClient;
    private final BookSynopsisRepository repository;
    private final ObjectMapper objectMapper;

    private static final String SYSTEM_INSTRUCTION = """
            You are Archivalia's Master Academic Bibliographer and University Professor.
            Given a book's title, author, and subject domain, produce an intellectually rigorous, comprehensive academic synopsis and chapter breakdown.
            
            Return strictly a single valid JSON object adhering to this schema:
            {
              "overview": "Comprehensive 2-3 paragraph academic overview detailing the foundational theory, intellectual arguments, and significance of the work.",
              "targetAudience": "Target academic and professional audience level (e.g. 'Advanced Undergraduate / Graduate Students, Systems Engineers')",
              "prerequisites": ["List of 2 to 4 prerequisite concepts or mathematical foundations recommended before reading"],
              "keyThemes": [
                "Detailed breakdown of Theme / Part 1: Core concepts, methods, and formalisms",
                "Detailed breakdown of Theme / Part 2: Implementation, edge cases, and architectures",
                "Detailed breakdown of Theme / Part 3: Advanced paradigms, trade-offs, and future directions"
              ],
              "theoryVsPractical": "Balance assessment (e.g. '40% Theoretical Foundations, 60% Systems Engineering')",
              "pedagogicalValue": "Why this book is considered essential in university curricula and academic research.",
              "corePrinciple": "The central thesis, golden rule, or most enduring foundational quote/takeaway of the entire book."
            }
            Do not output any markdown code fences or conversational text outside the JSON.
            """;

    public BookSynopsisService(GeminiApiClient geminiApiClient, BookSynopsisRepository repository, ObjectMapper objectMapper) {
        this.geminiApiClient = geminiApiClient;
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public BookSynopsisResponse generateOrGetSynopsis(BookSynopsisRequest request) {
        // 1. Check Cache by ISBN or Title
        if (request.getIsbn() != null && !request.getIsbn().isBlank()) {
            Optional<BookSynopsis> existing = repository.findByIsbn(request.getIsbn());
            if (existing.isPresent()) {
                log.info("Returning cached synopsis for ISBN: {}", request.getIsbn());
                return mapToResponse(existing.get(), true);
            }
        }

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            Optional<BookSynopsis> existing = repository.findByBookTitleIgnoreCase(request.getTitle().trim());
            if (existing.isPresent()) {
                log.info("Returning cached synopsis for Title: {}", request.getTitle());
                return mapToResponse(existing.get(), true);
            }
        }

        // 2. Generate with Gemini
        String userPrompt = String.format("""
                BOOK TITLE: %s
                AUTHOR: %s
                ISBN: %s
                CATEGORY / DOMAIN: %s
                """,
                request.getTitle(),
                request.getAuthor() != null ? request.getAuthor() : "Unknown",
                request.getIsbn() != null ? request.getIsbn() : "N/A",
                request.getCategory() != null ? request.getCategory() : "Academic Literature"
        );

        log.info("Generating dynamic academic synopsis with Gemini for: {}", request.getTitle());

        GeminiApiClient.GenerateResult geminiResult = geminiApiClient.generateWithSystemInstruction(
                SYSTEM_INSTRUCTION, userPrompt, true);

        BookSynopsis synopsis = new BookSynopsis();
        synopsis.setBookTitle(request.getTitle());
        synopsis.setAuthor(request.getAuthor());
        synopsis.setIsbn(request.getIsbn());
        synopsis.setModelUsed(geminiResult.modelUsed());
        synopsis.setPromptTokens(geminiResult.promptTokens());
        synopsis.setCandidateTokens(geminiResult.candidateTokens());

        try {
            JsonNode root = objectMapper.readTree(geminiResult.content());
            synopsis.setOverview(root.path("overview").asText(""));
            synopsis.setTargetAudience(root.path("targetAudience").asText(""));
            synopsis.setTheoryVsPractical(root.path("theoryVsPractical").asText("50% Theory / 50% Practice"));
            synopsis.setPedagogicalValue(root.path("pedagogicalValue").asText(""));
            synopsis.setCorePrinciple(root.path("corePrinciple").asText(""));

            List<String> prereqs = parseList(root.path("prerequisites"));
            List<String> themes = parseList(root.path("keyThemes"));

            synopsis.setPrerequisites(objectMapper.writeValueAsString(prereqs));
            synopsis.setKeyThemes(objectMapper.writeValueAsString(themes));
        } catch (Exception e) {
            log.warn("Failed to parse synopsis JSON, falling back to direct content: {}", e.getMessage());
            synopsis.setOverview(geminiResult.content());
            synopsis.setTargetAudience("University Students and Academic Researchers");
            synopsis.setTheoryVsPractical("Academic Study");
            synopsis.setPedagogicalValue("Authoritative reference in the discipline.");
            synopsis.setCorePrinciple("Foundational academic literature.");
            synopsis.setPrerequisites("[]");
            synopsis.setKeyThemes("[]");
        }

        BookSynopsis saved = repository.save(synopsis);
        return mapToResponse(saved, false);
    }

    public Optional<BookSynopsisResponse> getSynopsisByIdentifier(String identifier) {
        Optional<BookSynopsis> byIsbn = repository.findByIsbn(identifier);
        if (byIsbn.isPresent()) {
            return Optional.of(mapToResponse(byIsbn.get(), true));
        }
        Optional<BookSynopsis> byTitle = repository.findByBookTitleIgnoreCase(identifier);
        return byTitle.map(s -> mapToResponse(s, true));
    }

    private BookSynopsisResponse mapToResponse(BookSynopsis synopsis, boolean cached) {
        BookSynopsisResponse response = new BookSynopsisResponse();
        response.setId(synopsis.getId());
        response.setBookTitle(synopsis.getBookTitle());
        response.setAuthor(synopsis.getAuthor());
        response.setIsbn(synopsis.getIsbn());
        response.setOverview(synopsis.getOverview());
        response.setTargetAudience(synopsis.getTargetAudience());
        response.setTheoryVsPractical(synopsis.getTheoryVsPractical());
        response.setPedagogicalValue(synopsis.getPedagogicalValue());
        response.setCorePrinciple(synopsis.getCorePrinciple());
        response.setModelUsed(synopsis.getModelUsed());
        response.setPromptTokens(synopsis.getPromptTokens());
        response.setCandidateTokens(synopsis.getCandidateTokens());
        response.setCached(cached);

        response.setPrerequisites(deserializeList(synopsis.getPrerequisites()));
        response.setKeyThemes(deserializeList(synopsis.getKeyThemes()));

        return response;
    }

    private List<String> parseList(JsonNode node) {
        List<String> list = new ArrayList<>();
        if (node != null && node.isArray()) {
            for (JsonNode item : node) list.add(item.asText());
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
