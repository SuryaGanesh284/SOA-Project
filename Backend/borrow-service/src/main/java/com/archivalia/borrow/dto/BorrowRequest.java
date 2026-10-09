package com.archivalia.borrow.dto;

import jakarta.validation.constraints.NotBlank;

public class BorrowRequest {

    private String userId;
    private String userName;
    private String userEmail;

    @NotBlank(message = "Book title is required")
    private String title;

    private String copyCode;
    private Integer days = 14;

    public BorrowRequest() {
    }

    public BorrowRequest(String userId, String userName, String userEmail, String title, String copyCode) {
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.title = title;
        this.copyCode = copyCode;
        this.days = 14;
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

    public String getCopyCode() {
        return copyCode;
    }

    public void setCopyCode(String copyCode) {
        this.copyCode = copyCode;
    }

    public Integer getDays() {
        return days;
    }

    public void setDays(Integer days) {
        this.days = days;
    }
}
