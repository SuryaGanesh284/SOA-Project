package com.archivalia.ai.dto;

import jakarta.validation.constraints.NotBlank;

public class StudyPackRequest {

    private String isbn;

    @NotBlank(message = "Book title is required")
    private String bookTitle;

    private String author;

    private String topicOrExamFocus;

    private String difficultyLevel; // e.g. "Introductory", "Intermediate", "Advanced"

    private boolean forceRefresh;

    public StudyPackRequest() {
    }

    public StudyPackRequest(String isbn, String bookTitle, String author,
                            String topicOrExamFocus, String difficultyLevel, boolean forceRefresh) {
        this.isbn = isbn;
        this.bookTitle = bookTitle;
        this.author = author;
        this.topicOrExamFocus = topicOrExamFocus;
        this.difficultyLevel = difficultyLevel;
        this.forceRefresh = forceRefresh;
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

    public boolean isForceRefresh() {
        return forceRefresh;
    }

    public void setForceRefresh(boolean forceRefresh) {
        this.forceRefresh = forceRefresh;
    }
}
