package com.archivalia.ai.dto;

import java.util.List;

public class QuizQuestionDto {

    private int questionNumber;
    private String question;
    private List<String> options;
    private int correctAnswerIndex;
    private String explanation;
    private String conceptTested;

    public QuizQuestionDto() {
    }

    public QuizQuestionDto(int questionNumber, String question, List<String> options,
                           int correctAnswerIndex, String explanation, String conceptTested) {
        this.questionNumber = questionNumber;
        this.question = question;
        this.options = options;
        this.correctAnswerIndex = correctAnswerIndex;
        this.explanation = explanation;
        this.conceptTested = conceptTested;
    }

    public int getQuestionNumber() {
        return questionNumber;
    }

    public void setQuestionNumber(int questionNumber) {
        this.questionNumber = questionNumber;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public int getCorrectAnswerIndex() {
        return correctAnswerIndex;
    }

    public void setCorrectAnswerIndex(int correctAnswerIndex) {
        this.correctAnswerIndex = correctAnswerIndex;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getConceptTested() {
        return conceptTested;
    }

    public void setConceptTested(String conceptTested) {
        this.conceptTested = conceptTested;
    }
}
