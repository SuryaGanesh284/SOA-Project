package com.archivalia.ai.dto;

import java.util.List;

public class QuizEvaluationResponse {

    private Long studyPackId;
    private int totalQuestions;
    private int correctCount;
    private double scorePercentage;
    private String performanceTier;
    private String feedback;
    private List<QuestionEvaluationDetail> details;

    public QuizEvaluationResponse() {
    }

    public QuizEvaluationResponse(Long studyPackId, int totalQuestions, int correctCount,
                                  double scorePercentage, String performanceTier,
                                  String feedback, List<QuestionEvaluationDetail> details) {
        this.studyPackId = studyPackId;
        this.totalQuestions = totalQuestions;
        this.correctCount = correctCount;
        this.scorePercentage = scorePercentage;
        this.performanceTier = performanceTier;
        this.feedback = feedback;
        this.details = details;
    }

    public Long getStudyPackId() {
        return studyPackId;
    }

    public void setStudyPackId(Long studyPackId) {
        this.studyPackId = studyPackId;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public int getCorrectCount() {
        return correctCount;
    }

    public void setCorrectCount(int correctCount) {
        this.correctCount = correctCount;
    }

    public double getScorePercentage() {
        return scorePercentage;
    }

    public void setScorePercentage(double scorePercentage) {
        this.scorePercentage = scorePercentage;
    }

    public String getPerformanceTier() {
        return performanceTier;
    }

    public void setPerformanceTier(String performanceTier) {
        this.performanceTier = performanceTier;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public List<QuestionEvaluationDetail> getDetails() {
        return details;
    }

    public void setDetails(List<QuestionEvaluationDetail> details) {
        this.details = details;
    }
}
