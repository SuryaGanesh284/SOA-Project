package com.archivalia.fine.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateFineRequest {

    private Long loanId;
    private String userId = "USR-101";
    private String userName = "Ben Bradle";
    private String userEmail = "user@archivalia.test";

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Amount is required")
    private Integer amount;

    private String reason;

    public CreateFineRequest() {
    }

    public CreateFineRequest(Long loanId, String userId, String userName, String userEmail, String title, Integer amount, String reason) {
        this.loanId = loanId;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.title = title;
        this.amount = amount;
        this.reason = reason;
    }

    public Long getLoanId() {
        return loanId;
    }

    public void setLoanId(Long loanId) {
        this.loanId = loanId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
