package com.archivalia.borrow.client.dto;

import java.time.LocalDateTime;

public class FineCalculationRequest {
    private Long borrowId;
    private String userId;
    private LocalDateTime dueAt;
    private LocalDateTime returnedAt;

    public FineCalculationRequest(Long borrowId, String userId, LocalDateTime dueAt, LocalDateTime returnedAt) {
        this.borrowId = borrowId;
        this.userId = userId;
        this.dueAt = dueAt;
        this.returnedAt = returnedAt;
    }

    public Long getBorrowId() { return borrowId; }
    public void setBorrowId(Long borrowId) { this.borrowId = borrowId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public LocalDateTime getDueAt() { return dueAt; }
    public void setDueAt(LocalDateTime dueAt) { this.dueAt = dueAt; }

    public LocalDateTime getReturnedAt() { return returnedAt; }
    public void setReturnedAt(LocalDateTime returnedAt) { this.returnedAt = returnedAt; }
}
