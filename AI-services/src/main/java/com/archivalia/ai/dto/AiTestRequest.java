package com.archivalia.ai.dto;

import jakarta.validation.constraints.NotBlank;

public class AiTestRequest {

    @NotBlank(message = "Prompt must not be blank")
    private String prompt;

    private boolean jsonMode;

    public AiTestRequest() {}

    public AiTestRequest(String prompt, boolean jsonMode) {
        this.prompt = prompt;
        this.jsonMode = jsonMode;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public boolean isJsonMode() {
        return jsonMode;
    }

    public void setJsonMode(boolean jsonMode) {
        this.jsonMode = jsonMode;
    }
}
