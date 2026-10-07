package com.archivalia.ai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictive_demand_reports")
public class PredictiveDemandReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String overallCirculationHealth;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String executiveSummary;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String forecastJson;

    private int analyzedBookCount;

    private int criticalShortageCount;

    private int highRiskCount;

    private int totalRecommendedCopies;

    private double totalEstimatedBudgetInr;

    private String modelUsed;

    private LocalDateTime generatedAt;

    public PredictiveDemandReport() {
        this.generatedAt = LocalDateTime.now();
    }

    public PredictiveDemandReport(String overallCirculationHealth, String executiveSummary,
                                  String forecastJson, int analyzedBookCount, int criticalShortageCount,
                                  int highRiskCount, int totalRecommendedCopies, double totalEstimatedBudgetInr,
                                  String modelUsed) {
        this.overallCirculationHealth = overallCirculationHealth;
        this.executiveSummary = executiveSummary;
        this.forecastJson = forecastJson;
        this.analyzedBookCount = analyzedBookCount;
        this.criticalShortageCount = criticalShortageCount;
        this.highRiskCount = highRiskCount;
        this.totalRecommendedCopies = totalRecommendedCopies;
        this.totalEstimatedBudgetInr = totalEstimatedBudgetInr;
        this.modelUsed = modelUsed;
        this.generatedAt = LocalDateTime.now();
    }

    @PrePersist
    public void onPrePersist() {
        if (this.generatedAt == null) {
            this.generatedAt = LocalDateTime.now();
        }
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOverallCirculationHealth() {
        return overallCirculationHealth;
    }

    public void setOverallCirculationHealth(String overallCirculationHealth) {
        this.overallCirculationHealth = overallCirculationHealth;
    }

    public String getExecutiveSummary() {
        return executiveSummary;
    }

    public void setExecutiveSummary(String executiveSummary) {
        this.executiveSummary = executiveSummary;
    }

    public String getForecastJson() {
        return forecastJson;
    }

    public void setForecastJson(String forecastJson) {
        this.forecastJson = forecastJson;
    }

    public int getAnalyzedBookCount() {
        return analyzedBookCount;
    }

    public void setAnalyzedBookCount(int analyzedBookCount) {
        this.analyzedBookCount = analyzedBookCount;
    }

    public int getCriticalShortageCount() {
        return criticalShortageCount;
    }

    public void setCriticalShortageCount(int criticalShortageCount) {
        this.criticalShortageCount = criticalShortageCount;
    }

    public int getHighRiskCount() {
        return highRiskCount;
    }

    public void setHighRiskCount(int highRiskCount) {
        this.highRiskCount = highRiskCount;
    }

    public int getTotalRecommendedCopies() {
        return totalRecommendedCopies;
    }

    public void setTotalRecommendedCopies(int totalRecommendedCopies) {
        this.totalRecommendedCopies = totalRecommendedCopies;
    }

    public double getTotalEstimatedBudgetInr() {
        return totalEstimatedBudgetInr;
    }

    public void setTotalEstimatedBudgetInr(double totalEstimatedBudgetInr) {
        this.totalEstimatedBudgetInr = totalEstimatedBudgetInr;
    }

    public String getModelUsed() {
        return modelUsed;
    }

    public void setModelUsed(String modelUsed) {
        this.modelUsed = modelUsed;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }
}
