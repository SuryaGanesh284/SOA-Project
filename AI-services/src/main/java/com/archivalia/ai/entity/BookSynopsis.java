package com.archivalia.ai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "book_synopses")
public class BookSynopsis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "book_title", nullable = false)
    private String bookTitle;

    @Column(name = "author")
    private String author;

    @Column(name = "isbn")
    private String isbn;

    @Column(name = "overview", columnDefinition = "LONGTEXT")
    private String overview;

    @Column(name = "target_audience")
    private String targetAudience;

    @Column(name = "prerequisites", columnDefinition = "TEXT")
    private String prerequisites;

    @Column(name = "key_themes", columnDefinition = "LONGTEXT")
    private String keyThemes;

    @Column(name = "theory_vs_practical")
    private String theoryVsPractical;

    @Column(name = "pedagogical_value", columnDefinition = "TEXT")
    private String pedagogicalValue;

    @Column(name = "core_principle", columnDefinition = "TEXT")
    private String corePrinciple;

    @Column(name = "model_used")
    private String modelUsed;

    @Column(name = "prompt_tokens")
    private int promptTokens;

    @Column(name = "candidate_tokens")
    private int candidateTokens;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public BookSynopsis() {
        this.createdAt = LocalDateTime.now();
    }

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

    public String getPrerequisites() {
        return prerequisites;
    }

    public void setPrerequisites(String prerequisites) {
        this.prerequisites = prerequisites;
    }

    public String getKeyThemes() {
        return keyThemes;
    }

    public void setKeyThemes(String keyThemes) {
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
