package com.archivalia.ai.dto;

import java.util.List;

public class PredictiveDemandReportResponse {

    private Long id;
    private String generatedAt;
    private int analyzedBookCount;
    private int criticalShortageCount;
    private int highRiskCount;
    private int moderateRiskCount;
    private int stableCount;
    private int totalRecommendedCopies;
    private double totalEstimatedBudgetInr;
    private String overallCirculationHealth;
    private String executiveSummary;
    private List<PredictiveDemandItem> items;
    private String modelUsed;
    private boolean cached;

    public PredictiveDemandReportResponse() {
    }

    public PredictiveDemandReportResponse(Long id, String generatedAt, int analyzedBookCount,
                                          int criticalShortageCount, int highRiskCount,
                                          int moderateRiskCount, int stableCount,
                                          int totalRecommendedCopies, double totalEstimatedBudgetInr,
                                          String overallCirculationHealth, String executiveSummary,
                                          List<PredictiveDemandItem> items, String modelUsed,
                                          boolean cached) {
        this.id = id;
        this.generatedAt = generatedAt;
        this.analyzedBookCount = analyzedBookCount;
        this.criticalShortageCount = criticalShortageCount;
        this.highRiskCount = highRiskCount;
        this.moderateRiskCount = moderateRiskCount;
        this.stableCount = stableCount;
        this.totalRecommendedCopies = totalRecommendedCopies;
        this.totalEstimatedBudgetInr = totalEstimatedBudgetInr;
        this.overallCirculationHealth = overallCirculationHealth;
        this.executiveSummary = executiveSummary;
        this.items = items;
        this.modelUsed = modelUsed;
        this.cached = cached;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(String generatedAt) {
        this.generatedAt = generatedAt;
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

    public int getModerateRiskCount() {
        return moderateRiskCount;
    }

    public void setModerateRiskCount(int moderateRiskCount) {
        this.moderateRiskCount = moderateRiskCount;
    }

    public int getStableCount() {
        return stableCount;
    }

    public void setStableCount(int stableCount) {
        this.stableCount = stableCount;
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

    public List<PredictiveDemandItem> getItems() {
        return items;
    }

    public void setItems(List<PredictiveDemandItem> items) {
        this.items = items;
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
}
