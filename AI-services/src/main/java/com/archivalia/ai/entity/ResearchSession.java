package com.archivalia.ai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "academic_research_sessions")
public class ResearchSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "query", columnDefinition = "TEXT", nullable = false)
    private String query;

    @Column(name = "academic_field")
    private String academicField;

    @Column(name = "difficulty_level")
    private String difficultyLevel;

    @Column(name = "executive_summary", columnDefinition = "TEXT")
    private String executiveSummary;

    @Column(name = "step_by_step_solution", columnDefinition = "LONGTEXT")
    private String stepByStepSolution;

    @Column(name = "mathematical_formulations", columnDefinition = "TEXT")
    private String mathematicalFormulations;

    @Column(name = "real_world_applications", columnDefinition = "TEXT")
    private String realWorldApplications;

    @Column(name = "recommended_textbooks", columnDefinition = "TEXT")
    private String recommendedTextbooks;

    @Column(name = "recommended_search_keywords", columnDefinition = "TEXT")
    private String recommendedSearchKeywords;

    @Column(name = "follow_up_research_questions", columnDefinition = "TEXT")
    private String followUpResearchQuestions;

    @Column(name = "model_used")
    private String modelUsed;

    @Column(name = "prompt_tokens")
    private int promptTokens;

    @Column(name = "candidate_tokens")
    private int candidateTokens;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public ResearchSession() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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

    public String getMathematicalFormulations() {
        return mathematicalFormulations;
    }

    public void setMathematicalFormulations(String mathematicalFormulations) {
        this.mathematicalFormulations = mathematicalFormulations;
    }

    public String getRealWorldApplications() {
        return realWorldApplications;
    }

    public void setRealWorldApplications(String realWorldApplications) {
        this.realWorldApplications = realWorldApplications;
    }

    public String getRecommendedTextbooks() {
        return recommendedTextbooks;
    }

    public void setRecommendedTextbooks(String recommendedTextbooks) {
        this.recommendedTextbooks = recommendedTextbooks;
    }

    public String getRecommendedSearchKeywords() {
        return recommendedSearchKeywords;
    }

    public void setRecommendedSearchKeywords(String recommendedSearchKeywords) {
        this.recommendedSearchKeywords = recommendedSearchKeywords;
    }

    public String getFollowUpResearchQuestions() {
        return followUpResearchQuestions;
    }

    public void setFollowUpResearchQuestions(String followUpResearchQuestions) {
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
