package com.archivalia.book.dto;

import java.util.Map;

public class AdminDashboardDto {

    private long titles;
    private long copies;
    private long availableCopies;
    private long borrowedCopies;
    private long maintenanceCopies;
    private long activeLoans;
    private long totalUsers;
    private long pendingFines;
    private int outstandingAmount;
    private long totalPaidFines;
    private int totalCollectedAmount;
    private long openRequirements;
    private long fulfilledRequirements;
    private Map<String, String> servicesStatus;

    public AdminDashboardDto() {
    }

    public AdminDashboardDto(long titles, long copies, long availableCopies, long borrowedCopies,
                             long maintenanceCopies, long activeLoans, long totalUsers,
                             long pendingFines, int outstandingAmount, long totalPaidFines,
                             int totalCollectedAmount, long openRequirements, long fulfilledRequirements,
                             Map<String, String> servicesStatus) {
        this.titles = titles;
        this.copies = copies;
        this.availableCopies = availableCopies;
        this.borrowedCopies = borrowedCopies;
        this.maintenanceCopies = maintenanceCopies;
        this.activeLoans = activeLoans;
        this.totalUsers = totalUsers;
        this.pendingFines = pendingFines;
        this.outstandingAmount = outstandingAmount;
        this.totalPaidFines = totalPaidFines;
        this.totalCollectedAmount = totalCollectedAmount;
        this.openRequirements = openRequirements;
        this.fulfilledRequirements = fulfilledRequirements;
        this.servicesStatus = servicesStatus;
    }

    public long getTitles() {
        return titles;
    }

    public void setTitles(long titles) {
        this.titles = titles;
    }

    public long getCopies() {
        return copies;
    }

    public void setCopies(long copies) {
        this.copies = copies;
    }

    public long getAvailableCopies() {
        return availableCopies;
    }

    public void setAvailableCopies(long availableCopies) {
        this.availableCopies = availableCopies;
    }

    public long getBorrowedCopies() {
        return borrowedCopies;
    }

    public void setBorrowedCopies(long borrowedCopies) {
        this.borrowedCopies = borrowedCopies;
    }

    public long getMaintenanceCopies() {
        return maintenanceCopies;
    }

    public void setMaintenanceCopies(long maintenanceCopies) {
        this.maintenanceCopies = maintenanceCopies;
    }

    public long getActiveLoans() {
        return activeLoans;
    }

    public void setActiveLoans(long activeLoans) {
        this.activeLoans = activeLoans;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getPendingFines() {
        return pendingFines;
    }

    public void setPendingFines(long pendingFines) {
        this.pendingFines = pendingFines;
    }

    public int getOutstandingAmount() {
        return outstandingAmount;
    }

    public void setOutstandingAmount(int outstandingAmount) {
        this.outstandingAmount = outstandingAmount;
    }

    public long getTotalPaidFines() {
        return totalPaidFines;
    }

    public void setTotalPaidFines(long totalPaidFines) {
        this.totalPaidFines = totalPaidFines;
    }

    public int getTotalCollectedAmount() {
        return totalCollectedAmount;
    }

    public void setTotalCollectedAmount(int totalCollectedAmount) {
        this.totalCollectedAmount = totalCollectedAmount;
    }

    public long getOpenRequirements() {
        return openRequirements;
    }

    public void setOpenRequirements(long openRequirements) {
        this.openRequirements = openRequirements;
    }

    public long getFulfilledRequirements() {
        return fulfilledRequirements;
    }

    public void setFulfilledRequirements(long fulfilledRequirements) {
        this.fulfilledRequirements = fulfilledRequirements;
    }

    public Map<String, String> getServicesStatus() {
        return servicesStatus;
    }

    public void setServicesStatus(Map<String, String> servicesStatus) {
        this.servicesStatus = servicesStatus;
    }
}
