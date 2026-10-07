package com.archivalia.ai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_packs", indexes = {
        @Index(name = "idx_studypack_isbn", columnList = "isbn"),
        @Index(name = "idx_studypack_title", columnList = "bookTitle")
})
public class StudyPack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String bookTitle;

    private String author;

    private String isbn;

    private String topicOrExamFocus;

    private String difficultyLevel;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String executiveSummary;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String highYieldPrinciplesJson;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String formulaeOrAlgorithmsJson;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String prerequisitesJson;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String realWorldApplicationsJson;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String quizQuestionsJson;

    private String modelUsed;

    private LocalDateTime createdAt;

    public StudyPack() {
        this.createdAt = LocalDateTime.now();
    }

    public StudyPack(String bookTitle, String author, String isbn, String topicOrExamFocus,
                     String difficultyLevel, String executiveSummary, String highYieldPrinciplesJson,
                     String formulaeOrAlgorithmsJson, String prerequisitesJson,
                     String realWorldApplicationsJson, String quizQuestionsJson, String modelUsed) {
        this.bookTitle = bookTitle;
        this.author = author;
        this.isbn = isbn;
        this.topicOrExamFocus = topicOrExamFocus;
        this.difficultyLevel = difficultyLevel;
        this.executiveSummary = executiveSummary;
        this.highYieldPrinciplesJson = highYieldPrinciplesJson;
        this.formulaeOrAlgorithmsJson = formulaeOrAlgorithmsJson;
        this.prerequisitesJson = prerequisitesJson;
        this.realWorldApplicationsJson = realWorldApplicationsJson;
        this.quizQuestionsJson = quizQuestionsJson;
        this.modelUsed = modelUsed;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    public void onPrePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    // Getters and Setters

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

    public String getHighYieldPrinciplesJson() {
        return highYieldPrinciplesJson;
    }

    public void setHighYieldPrinciplesJson(String highYieldPrinciplesJson) {
        this.highYieldPrinciplesJson = highYieldPrinciplesJson;
    }

    public String getFormulaeOrAlgorithmsJson() {
        return formulaeOrAlgorithmsJson;
    }

    public void setFormulaeOrAlgorithmsJson(String formulaeOrAlgorithmsJson) {
        this.formulaeOrAlgorithmsJson = formulaeOrAlgorithmsJson;
    }

    public String getPrerequisitesJson() {
        return prerequisitesJson;
    }

    public void setPrerequisitesJson(String prerequisitesJson) {
        this.prerequisitesJson = prerequisitesJson;
    }

    public String getRealWorldApplicationsJson() {
        return realWorldApplicationsJson;
    }

    public void setRealWorldApplicationsJson(String realWorldApplicationsJson) {
        this.realWorldApplicationsJson = realWorldApplicationsJson;
    }

    public String getQuizQuestionsJson() {
        return quizQuestionsJson;
    }

    public void setQuizQuestionsJson(String quizQuestionsJson) {
        this.quizQuestionsJson = quizQuestionsJson;
    }

    public String getModelUsed() {
        return modelUsed;
    }

    public void setModelUsed(String modelUsed) {
        this.modelUsed = modelUsed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
