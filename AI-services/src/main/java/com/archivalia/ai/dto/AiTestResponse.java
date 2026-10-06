package com.archivalia.ai.dto;

import java.time.Instant;

public class AiTestResponse {

    private boolean success;
    private String response;
    private String model;
    private boolean fallbackUsed;
    private int promptTokens;
    private int candidateTokens;
    private String timestamp;

    public AiTestResponse() {
        this.timestamp = Instant.now().toString();
    }

    public AiTestResponse(boolean success, String response, String model, boolean fallbackUsed, int promptTokens, int candidateTokens) {
        this.success = success;
        this.response = response;
        this.model = model;
        this.fallbackUsed = fallbackUsed;
        this.promptTokens = promptTokens;
        this.candidateTokens = candidateTokens;
        this.timestamp = Instant.now().toString();
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public boolean isFallbackUsed() {
        return fallbackUsed;
    }

    public void setFallbackUsed(boolean fallbackUsed) {
        this.fallbackUsed = fallbackUsed;
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

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
