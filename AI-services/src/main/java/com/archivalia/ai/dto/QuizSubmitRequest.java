package com.archivalia.ai.dto;

import jakarta.validation.constraints.NotNull;
import java.util.Map;

public class QuizSubmitRequest {

    @NotNull(message = "Study pack ID is required")
    private Long studyPackId;

    // questionNumber (1-indexed) -> selectedOptionIndex (0-3)
    private Map<Integer, Integer> answers;

    public QuizSubmitRequest() {
    }

    public QuizSubmitRequest(Long studyPackId, Map<Integer, Integer> answers) {
        this.studyPackId = studyPackId;
        this.answers = answers;
    }

    public Long getStudyPackId() {
        return studyPackId;
    }

    public void setStudyPackId(Long studyPackId) {
        this.studyPackId = studyPackId;
    }

    public Map<Integer, Integer> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Integer, Integer> answers) {
        this.answers = answers;
    }
}
