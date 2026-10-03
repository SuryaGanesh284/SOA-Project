package com.archivalia.borrow.dto;

public class LoanDto {

    private Long id;
    private String loanCode;
    private String userId;
    private String userName;
    private String userEmail;
    private String copyCode;
    private String title;
    private String borrowedAt;
    private String dueAt;
    private String returnedAt;
    private String status;

    public LoanDto() {
    }

    public LoanDto(Long id, String loanCode, String userId, String userName, String userEmail, String copyCode, String title, String borrowedAt, String dueAt, String returnedAt, String status) {
        this.id = id;
        this.loanCode = loanCode;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.copyCode = copyCode;
        this.title = title;
        this.borrowedAt = borrowedAt;
        this.dueAt = dueAt;
        this.returnedAt = returnedAt;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLoanCode() {
        return loanCode;
    }

    public void setLoanCode(String loanCode) {
        this.loanCode = loanCode;
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

    public String getCopyCode() {
        return copyCode;
    }

    public void setCopyCode(String copyCode) {
        this.copyCode = copyCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBorrowedAt() {
        return borrowedAt;
    }

    public void setBorrowedAt(String borrowedAt) {
        this.borrowedAt = borrowedAt;
    }

    public String getDueAt() {
        return dueAt;
    }

    public void setDueAt(String dueAt) {
        this.dueAt = dueAt;
    }

    public String getReturnedAt() {
        return returnedAt;
    }

    public void setReturnedAt(String returnedAt) {
        this.returnedAt = returnedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
