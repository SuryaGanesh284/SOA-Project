package com.archivalia.ai.dto;

import java.util.List;

public class SemanticSearchResponse {

    private String query;
    private String conceptualSummary;
    private List<SemanticSearchResult> results;
    private List<String> recommendedExternalAdditions;
    private String modelUsed;
    private int promptTokens;
    private int candidateTokens;

    public SemanticSearchResponse() {}

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getConceptualSummary() {
        return conceptualSummary;
    }

    public void setConceptualSummary(String conceptualSummary) {
        this.conceptualSummary = conceptualSummary;
    }

    public List<SemanticSearchResult> getResults() {
        return results;
    }

    public void setResults(List<SemanticSearchResult> results) {
        this.results = results;
    }

    public List<String> getRecommendedExternalAdditions() {
        return recommendedExternalAdditions;
    }

    public void setRecommendedExternalAdditions(List<String> recommendedExternalAdditions) {
        this.recommendedExternalAdditions = recommendedExternalAdditions;
    }

    public String getModelUsed() {
        return modelUsed;
    }

    public void setModelUsed(String modelUsed) {
        this.modelUsed = modelUsed;
    }

    public int getPromptTokens() {
        return promptTokens;
    }

    public void setPromptTokens(int promptTokens) {
        this.promptTokens = promptTokens;
    }

    public int getCandidateTokens() {
        return candidateTokens;
    }

    public void setCandidateTokens(int candidateTokens) {
        this.candidateTokens = candidateTokens;
    }
}
