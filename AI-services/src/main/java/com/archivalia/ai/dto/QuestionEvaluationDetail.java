package com.archivalia.ai.dto;

import java.util.List;

public class QuestionEvaluationDetail {

    private int questionNumber;
    private String question;
    private List<String> options;
    private Integer selectedOptionIndex;
    private int correctAnswerIndex;
    private boolean correct;
    private String explanation;
    private String conceptTested;

    public QuestionEvaluationDetail() {
    }

    public QuestionEvaluationDetail(int questionNumber, String question, List<String> options,
                                    Integer selectedOptionIndex, int correctAnswerIndex,
                                    boolean correct, String explanation, String conceptTested) {
        this.questionNumber = questionNumber;
        this.question = question;
        this.options = options;
        this.selectedOptionIndex = selectedOptionIndex;
        this.correctAnswerIndex = correctAnswerIndex;
        this.correct = correct;
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

    public Integer getSelectedOptionIndex() {
        return selectedOptionIndex;
    }

    public void setSelectedOptionIndex(Integer selectedOptionIndex) {
        this.selectedOptionIndex = selectedOptionIndex;
    }

    public int getCorrectAnswerIndex() {
        return correctAnswerIndex;
    }

    public void setCorrectAnswerIndex(int correctAnswerIndex) {
        this.correctAnswerIndex = correctAnswerIndex;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
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
