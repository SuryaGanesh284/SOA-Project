package com.archivalia.ai.dto;

import jakarta.validation.constraints.NotBlank;

public class ResearchAssistRequest {

    @NotBlank(message = "Research query or academic problem cannot be blank")
    private String query;

    private String academicField;

    private String difficultyLevel;

    private String userId;

    public ResearchAssistRequest() {}

    public ResearchAssistRequest(String query, String academicField, String difficultyLevel, String userId) {
        this.query = query;
        this.academicField = academicField;
        this.difficultyLevel = difficultyLevel;
        this.userId = userId;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getAcademicField() {
        return academicField != null && !academicField.isBlank() ? academicField : "General STEM & Engineering";
    }

    public void setAcademicField(String academicField) {
        this.academicField = academicField;
    }

    public String getDifficultyLevel() {
        return difficultyLevel != null && !difficultyLevel.isBlank() ? difficultyLevel : "Undergraduate / Postgraduate";
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public String getUserId() {
        return userId != null && !userId.isBlank() ? userId : "anonymous_scholar";
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
