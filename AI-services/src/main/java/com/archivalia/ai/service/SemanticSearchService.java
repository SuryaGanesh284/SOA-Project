package com.archivalia.ai.service;

import com.archivalia.ai.client.GeminiApiClient;
import com.archivalia.ai.dto.SemanticSearchRequest;
import com.archivalia.ai.dto.SemanticSearchResponse;
import com.archivalia.ai.dto.SemanticSearchResult;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class SemanticSearchService {

    private static final Logger log = LoggerFactory.getLogger(SemanticSearchService.class);

    private final GeminiApiClient geminiApiClient;
    private final ObjectMapper objectMapper;

    // Default core academic catalog items for semantic matching
    private static final List<Map<String, Object>> DEFAULT_CATALOG = List.of(
            Map.of(
                    "title", "Designing Data-Intensive Applications",
                    "author", "Martin Kleppmann",
                    "category", "Distributed Systems & Databases",
                    "description", "The definitive guide to distributed consensus, Paxos, Raft, replication, partitioning, transactions, and event-driven architectures.",
                    "swatch", "from-sky-500 to-indigo-900"
            ),
            Map.of(
                    "title", "Structure and Interpretation of Computer Programs",
                    "author", "Harold Abelson & Gerald Jay Sussman",
                    "category", "Computer Science Principles",
                    "description", "A classic foundational text on programming abstractions, computational models, interpreters, recursion, and meta-linguistic abstraction.",
                    "swatch", "from-rose-500 to-red-950"
            ),
            Map.of(
                    "title", "Introduction to Algorithms (CLRS)",
                    "author", "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
                    "category", "Algorithms & Data Structures",
                    "description", "Comprehensive reference on algorithmic design, dynamic programming, greedy methods, graph algorithms, max flow, NP-completeness, and data structures.",
                    "swatch", "from-indigo-600 to-slate-900"
            ),
            Map.of(
                    "title", "Clean Code",
                    "author", "Robert C. Martin",
                    "category", "Software Engineering",
                    "description", "A handbook of agile craftsmanship, readable code design, solid refactoring techniques, error handling, and test-driven development.",
                    "swatch", "from-indigo-500 to-slate-900"
            ),
            Map.of(
                    "title", "The Pragmatic Programmer",
                    "author", "David Thomas & Andrew Hunt",
                    "category", "Software Engineering",
                    "description", "Practical habits for building software that is modular, extensible, and easier to change and maintain.",
                    "swatch", "from-emerald-500 to-teal-900"
            ),
            Map.of(
                    "title", "Deep Learning",
                    "author", "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
                    "category", "Artificial Intelligence & Neural Networks",
                    "description", "Comprehensive textbook on backpropagation, convolutional networks, recurrent architectures, autoencoders, and mathematical foundations of deep learning.",
                    "swatch", "from-purple-600 to-indigo-950"
            ),
            Map.of(
                    "title", "Algorithms to Live By",
                    "author", "Brian Christian & Tom Griffiths",
                    "category", "Cognitive Science & Computer Science",
                    "description", "Explores how optimal stopping, sorting, caching, and game theory apply to human decision-making and real-world problems.",
                    "swatch", "from-amber-500 to-orange-900"
            ),
            Map.of(
                    "title", "The Design of Everyday Things",
                    "author", "Don Norman",
                    "category", "Human-Computer Interaction",
                    "description", "Cognitive psychology and usability principles: affordances, signifiers, conceptual models, and user-centered design.",
                    "swatch", "from-sky-500 to-blue-900"
            )
    );

    private static final String SYSTEM_INSTRUCTION = """
            You are Archivalia's Academic Semantic Search Engine.
            Your task is to analyze the user's natural language conceptual inquiry or academic problem statement against a set of candidate library catalog books.
            Perform deep conceptual matching based on underlying academic principles, mathematics, domain concepts, and learning objectives—NOT merely keyword matching.
            
            Return strictly a single valid JSON object adhering to this schema:
            {
              "conceptualSummary": "Concise analysis of the core academic concepts the user is seeking.",
              "results": [
                {
                  "title": "Exact Title of matching book from catalog",
                  "author": "Author Name",
                  "matchScore": 95,
                  "relevanceExplanation": "In-depth rationale explaining why this book addresses the conceptual query.",
                  "keyTopicsMatched": ["Topic 1", "Topic 2", "Topic 3"],
                  "recommendedChapters": "Key chapters or sections to study (e.g. 'Chapters 8 & 9: Distributed Transactions and Consensus')",
                  "swatch": "from-sky-500 to-indigo-900"
                }
              ],
              "recommendedExternalAdditions": [
                "2 or 3 authoritative seminal textbooks in literature that directly answer this inquiry if the library catalog does not fully cover it"
              ]
            }
            Do not output any markdown code fences or conversational text outside the JSON.
            """;

    public SemanticSearchService(GeminiApiClient geminiApiClient, ObjectMapper objectMapper) {
        this.geminiApiClient = geminiApiClient;
        this.objectMapper = objectMapper;
    }

    public SemanticSearchResponse search(SemanticSearchRequest request) {
        List<Map<String, Object>> candidateCatalog = (request.getCatalogContext() != null && !request.getCatalogContext().isEmpty())
                ? request.getCatalogContext()
                : DEFAULT_CATALOG;

        String catalogJson;
        try {
            catalogJson = objectMapper.writeValueAsString(candidateCatalog);
        } catch (Exception e) {
            catalogJson = candidateCatalog.toString();
        }

        String userPrompt = String.format("""
                STUDENT CONCEPTUAL SEARCH INQUIRY:
                "%s"
                
                CANDIDATE LIBRARY CATALOG BOOKS:
                %s
                """, request.getQuery(), catalogJson);

        log.info("Executing semantic book search for query: {}", request.getQuery());

        GeminiApiClient.GenerateResult geminiResult = geminiApiClient.generateWithSystemInstruction(
                SYSTEM_INSTRUCTION, userPrompt, true);

        SemanticSearchResponse response = new SemanticSearchResponse();
        response.setQuery(request.getQuery());
        response.setModelUsed(geminiResult.modelUsed());
        response.setPromptTokens(geminiResult.promptTokens());
        response.setCandidateTokens(geminiResult.candidateTokens());

        try {
            JsonNode root = objectMapper.readTree(geminiResult.content());
            response.setConceptualSummary(root.path("conceptualSummary").asText(""));

            List<SemanticSearchResult> results = new ArrayList<>();
            JsonNode resultsNode = root.path("results");
            if (resultsNode.isArray()) {
                for (JsonNode item : resultsNode) {
                    SemanticSearchResult r = new SemanticSearchResult();
                    r.setTitle(item.path("title").asText(""));
                    r.setAuthor(item.path("author").asText(""));
                    r.setMatchScore(item.path("matchScore").asInt(75));
                    r.setRelevanceExplanation(item.path("relevanceExplanation").asText(""));
                    r.setRecommendedChapters(item.path("recommendedChapters").asText(""));
                    r.setSwatch(item.path("swatch").asText("from-indigo-600 to-slate-900"));

                    List<String> topics = new ArrayList<>();
                    JsonNode topicsNode = item.path("keyTopicsMatched");
                    if (topicsNode.isArray()) {
                        for (JsonNode t : topicsNode) topics.add(t.asText());
                    }
                    r.setKeyTopicsMatched(topics);
                    results.add(r);
                }
            }

            // Sort by match score descending and limit
            results.sort(Comparator.comparingInt(SemanticSearchResult::getMatchScore).reversed());
            if (results.size() > request.getLimit()) {
                results = results.subList(0, request.getLimit());
            }
            response.setResults(results);

            List<String> externalAdditions = new ArrayList<>();
            JsonNode extNode = root.path("recommendedExternalAdditions");
            if (extNode.isArray()) {
                for (JsonNode e : extNode) externalAdditions.add(e.asText());
            }
            response.setRecommendedExternalAdditions(externalAdditions);

        } catch (Exception e) {
            log.warn("Failed to parse structured semantic search response from Gemini: {}", e.getMessage());
            response.setConceptualSummary("Direct Conceptual Search Results for: " + request.getQuery());
            response.setResults(List.of());
            response.setRecommendedExternalAdditions(List.of("Recommended: Advanced Academic Textbook in " + request.getQuery()));
        }

        return response;
    }
}
