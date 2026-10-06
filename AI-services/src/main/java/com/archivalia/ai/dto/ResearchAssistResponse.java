package com.archivalia.ai.dto;

import java.util.List;

public class ResearchAssistResponse {

    private Long id;
    private String query;
    private String academicField;
    private String difficultyLevel;
    private String executiveSummary;
    private String stepByStepSolution;
    private List<String> mathematicalFormulations;
    private String realWorldApplications;
    private List<String> recommendedTextbooks;
    private List<String> recommendedSearchKeywords;
    private List<String> followUpResearchQuestions;
    private String modelUsed;
    private int promptTokens;
    private int candidateTokens;
    private String createdAt;

    public ResearchAssistResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getAcademicField() {
        return academicField;
    }

    public void setAcademicField(String academicField) {
        this.academicField = academicField;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public String getExecutiveSummary() {
        return executiveSummary;
    }

    public void setExecutiveSummary(String executiveSummary) {
        this.executiveSummary = executiveSummary;
    }

    public String getStepByStepSolution() {
        return stepByStepSolution;
    }

    public void setStepByStepSolution(String stepByStepSolution) {
        this.stepByStepSolution = stepByStepSolution;
    }

    public List<String> getMathematicalFormulations() {
        return mathematicalFormulations;
    }

    public void setMathematicalFormulations(List<String> mathematicalFormulations) {
        this.mathematicalFormulations = mathematicalFormulations;
    }

    public String getRealWorldApplications() {
        return realWorldApplications;
    }

    public void setRealWorldApplications(String realWorldApplications) {
        this.realWorldApplications = realWorldApplications;
    }

    public List<String> getRecommendedTextbooks() {
        return recommendedTextbooks;
    }

    public void setRecommendedTextbooks(List<String> recommendedTextbooks) {
        this.recommendedTextbooks = recommendedTextbooks;
    }

    public List<String> getRecommendedSearchKeywords() {
        return recommendedSearchKeywords;
    }

    public void setRecommendedSearchKeywords(List<String> recommendedSearchKeywords) {
        this.recommendedSearchKeywords = recommendedSearchKeywords;
    }

    public List<String> getFollowUpResearchQuestions() {
        return followUpResearchQuestions;
    }

    public void setFollowUpResearchQuestions(List<String> followUpResearchQuestions) {
        this.followUpResearchQuestions = followUpResearchQuestions;
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

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
