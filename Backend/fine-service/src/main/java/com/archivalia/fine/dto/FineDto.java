package com.archivalia.fine.dto;

public class FineDto {

    private Long id;
    private String fineCode;
    private Long loanId;
    private String userId;
    private String userName;
    private String title;
    private Integer amount;
    private String reason;
    private String status;
    private String issuedAt;
    private String paidAt;
    private String paymentReference;

    public FineDto() {
    }

    public FineDto(Long id, String fineCode, Long loanId, String userId, String userName, String title, Integer amount, String reason, String status, String issuedAt, String paidAt, String paymentReference) {
        this.id = id;
        this.fineCode = fineCode;
        this.loanId = loanId;
        this.userId = userId;
        this.userName = userName;
        this.title = title;
        this.amount = amount;
        this.reason = reason;
        this.status = status;
        this.issuedAt = issuedAt;
        this.paidAt = paidAt;
        this.paymentReference = paymentReference;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFineCode() {
        return fineCode;
    }

    public void setFineCode(String fineCode) {
        this.fineCode = fineCode;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(String issuedAt) {
        this.issuedAt = issuedAt;
    }

    public String getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(String paidAt) {
        this.paidAt = paidAt;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }
}
