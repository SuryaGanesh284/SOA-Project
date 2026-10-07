package com.archivalia.ai.dto;

public class PredictiveDemandItem {

    private String bookTitle;
    private String isbn;
    private String category;
    private int currentTotalCopies;
    private int currentAvailableCopies;
    private int activeBorrowsCount;
    private double borrowVelocityRatio;
    private int predictedDemandSurgePercent;
    private String stockoutRisk; // CRITICAL, HIGH, MODERATE, STABLE
    private int recommendedRequisitionCopies;
    private String urgencyLevel; // Immediate Requisition, Standard Restock, Adequate
    private String academicRationale;
    private double estimatedBudgetInr;

    public PredictiveDemandItem() {
    }

    public PredictiveDemandItem(String bookTitle, String isbn, String category, int currentTotalCopies,
                                int currentAvailableCopies, int activeBorrowsCount, double borrowVelocityRatio,
                                int predictedDemandSurgePercent, String stockoutRisk,
                                int recommendedRequisitionCopies, String urgencyLevel,
                                String academicRationale, double estimatedBudgetInr) {
        this.bookTitle = bookTitle;
        this.isbn = isbn;
        this.category = category;
        this.currentTotalCopies = currentTotalCopies;
        this.currentAvailableCopies = currentAvailableCopies;
        this.activeBorrowsCount = activeBorrowsCount;
        this.borrowVelocityRatio = borrowVelocityRatio;
        this.predictedDemandSurgePercent = predictedDemandSurgePercent;
        this.stockoutRisk = stockoutRisk;
        this.recommendedRequisitionCopies = recommendedRequisitionCopies;
        this.urgencyLevel = urgencyLevel;
        this.academicRationale = academicRationale;
        this.estimatedBudgetInr = estimatedBudgetInr;
    }

    public String getBookTitle() {
        return bookTitle;
    }

    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getCurrentTotalCopies() {
        return currentTotalCopies;
    }

    public void setCurrentTotalCopies(int currentTotalCopies) {
        this.currentTotalCopies = currentTotalCopies;
    }

    public int getCurrentAvailableCopies() {
        return currentAvailableCopies;
    }

    public void setCurrentAvailableCopies(int currentAvailableCopies) {
        this.currentAvailableCopies = currentAvailableCopies;
    }

    public int getActiveBorrowsCount() {
        return activeBorrowsCount;
    }

    public void setActiveBorrowsCount(int activeBorrowsCount) {
        this.activeBorrowsCount = activeBorrowsCount;
    }

    public double getBorrowVelocityRatio() {
        return borrowVelocityRatio;
    }

    public void setBorrowVelocityRatio(double borrowVelocityRatio) {
        this.borrowVelocityRatio = borrowVelocityRatio;
    }

    public int getPredictedDemandSurgePercent() {
        return predictedDemandSurgePercent;
    }

    public void setPredictedDemandSurgePercent(int predictedDemandSurgePercent) {
        this.predictedDemandSurgePercent = predictedDemandSurgePercent;
    }

    public String getStockoutRisk() {
        return stockoutRisk;
    }

    public void setStockoutRisk(String stockoutRisk) {
        this.stockoutRisk = stockoutRisk;
    }

    public int getRecommendedRequisitionCopies() {
        return recommendedRequisitionCopies;
    }

    public void setRecommendedRequisitionCopies(int recommendedRequisitionCopies) {
        this.recommendedRequisitionCopies = recommendedRequisitionCopies;
    }

    public String getUrgencyLevel() {
        return urgencyLevel;
    }

    public void setUrgencyLevel(String urgencyLevel) {
        this.urgencyLevel = urgencyLevel;
    }

    public String getAcademicRationale() {
        return academicRationale;
    }

    public void setAcademicRationale(String academicRationale) {
        this.academicRationale = academicRationale;
    }

    public double getEstimatedBudgetInr() {
        return estimatedBudgetInr;
    }

    public void setEstimatedBudgetInr(double estimatedBudgetInr) {
        this.estimatedBudgetInr = estimatedBudgetInr;
    }
}
