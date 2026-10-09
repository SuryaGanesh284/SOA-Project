package com.archivalia.ai.dto;

import java.util.List;

public class BookSynopsisResponse {

    private Long id;
    private String bookTitle;
    private String author;
    private String isbn;
    private String overview;
    private String targetAudience;
    private List<String> prerequisites;
    private List<String> keyThemes;
    private String theoryVsPractical;
    private String pedagogicalValue;
    private String corePrinciple;
    private String modelUsed;
    private int promptTokens;
    private int candidateTokens;
    private boolean cached;

    public BookSynopsisResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }

    public String getTargetAudience() {
        return targetAudience;
    }

    public void setTargetAudience(String targetAudience) {
        this.targetAudience = targetAudience;
    }

    public List<String> getPrerequisites() {
        return prerequisites;
    }

    public void setPrerequisites(List<String> prerequisites) {
        this.prerequisites = prerequisites;
    }

    public List<String> getKeyThemes() {
        return keyThemes;
    }

    public void setKeyThemes(List<String> keyThemes) {
        this.keyThemes = keyThemes;
    }

    public String getTheoryVsPractical() {
        return theoryVsPractical;
    }

    public void setTheoryVsPractical(String theoryVsPractical) {
        this.theoryVsPractical = theoryVsPractical;
    }

    public String getPedagogicalValue() {
        return pedagogicalValue;
    }

    public void setPedagogicalValue(String pedagogicalValue) {
        this.pedagogicalValue = pedagogicalValue;
    }

    public String getCorePrinciple() {
        return corePrinciple;
    }

    public void setCorePrinciple(String corePrinciple) {
        this.corePrinciple = corePrinciple;
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

    public boolean isCached() {
        return cached;
    }

    public void setCached(boolean cached) {
        this.cached = cached;
    }
}
