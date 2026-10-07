package com.archivalia.ai.dto;

import java.util.List;

public class StudyPackResponse {

    private Long id;
    private String isbn;
    private String bookTitle;
    private String author;
    private String topicOrExamFocus;
    private String difficultyLevel;
    private String executiveSummary;
    private List<String> highYieldPrinciples;
    private List<String> formulaeOrAlgorithms;
    private List<String> prerequisites;
    private List<String> realWorldApplications;
    private List<QuizQuestionDto> quizQuestions;
    private String modelUsed;
    private boolean cached;
    private String generatedAt;

    public StudyPackResponse() {
    }

    public StudyPackResponse(Long id, String isbn, String bookTitle, String author,
                             String topicOrExamFocus, String difficultyLevel,
                             String executiveSummary, List<String> highYieldPrinciples,
                             List<String> formulaeOrAlgorithms, List<String> prerequisites,
                             List<String> realWorldApplications, List<QuizQuestionDto> quizQuestions,
                             String modelUsed, boolean cached, String generatedAt) {
        this.id = id;
        this.isbn = isbn;
        this.bookTitle = bookTitle;
        this.author = author;
        this.topicOrExamFocus = topicOrExamFocus;
        this.difficultyLevel = difficultyLevel;
        this.executiveSummary = executiveSummary;
        this.highYieldPrinciples = highYieldPrinciples;
        this.formulaeOrAlgorithms = formulaeOrAlgorithms;
        this.prerequisites = prerequisites;
        this.realWorldApplications = realWorldApplications;
        this.quizQuestions = quizQuestions;
        this.modelUsed = modelUsed;
        this.cached = cached;
        this.generatedAt = generatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getBookTitle() {
        return bookTitle;
    }

    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getTopicOrExamFocus() {
        return topicOrExamFocus;
    }

    public void setTopicOrExamFocus(String topicOrExamFocus) {
        this.topicOrExamFocus = topicOrExamFocus;
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

    public List<String> getHighYieldPrinciples() {
        return highYieldPrinciples;
    }

    public void setHighYieldPrinciples(List<String> highYieldPrinciples) {
        this.highYieldPrinciples = highYieldPrinciples;
    }

    public List<String> getFormulaeOrAlgorithms() {
        return formulaeOrAlgorithms;
    }

    public void setFormulaeOrAlgorithms(List<String> formulaeOrAlgorithms) {
        this.formulaeOrAlgorithms = formulaeOrAlgorithms;
    }

    public List<String> getPrerequisites() {
        return prerequisites;
    }

    public void setPrerequisites(List<String> prerequisites) {
        this.prerequisites = prerequisites;
    }

    public List<String> getRealWorldApplications() {
        return realWorldApplications;
    }

    public void setRealWorldApplications(List<String> realWorldApplications) {
        this.realWorldApplications = realWorldApplications;
    }

    public List<QuizQuestionDto> getQuizQuestions() {
        return quizQuestions;
    }

    public void setQuizQuestions(List<QuizQuestionDto> quizQuestions) {
        this.quizQuestions = quizQuestions;
    }

    public String getModelUsed() {
        return modelUsed;
    }

    public void setModelUsed(String modelUsed) {
        this.modelUsed = modelUsed;
    }

    public boolean isCached() {
        return cached;
    }

    public void setCached(boolean cached) {
        this.cached = cached;
    }

    public String getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(String generatedAt) {
        this.generatedAt = generatedAt;
    }
}
