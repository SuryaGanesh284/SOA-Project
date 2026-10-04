package com.archivalia.fine.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "fines")
public class Fine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String fineCode;

    private Long loanId;

    @Column(nullable = false)
    private String userId;

    private String userName;

    private String userEmail;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Integer amount;

    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FineStatus status = FineStatus.PENDING;

    @Column(nullable = false)
    private LocalDate issuedAt;

    private LocalDate paidAt;

    private LocalDate waivedAt;

    private String paymentReference;

    private String paymentMethod;

    public Fine() {
    }

    public Fine(String fineCode, Long loanId, String userId, String userName, String userEmail, String title, Integer amount, String reason, LocalDate issuedAt) {
        this.fineCode = fineCode;
        this.loanId = loanId;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.title = title;
        this.amount = amount;
        this.reason = reason;
        this.issuedAt = issuedAt;
        this.status = FineStatus.PENDING;
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

    public FineStatus getStatus() {
        return status;
    }

    public void setStatus(FineStatus status) {
        this.status = status;
    }

    public LocalDate getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(LocalDate issuedAt) {
        this.issuedAt = issuedAt;
    }

    public LocalDate getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDate paidAt) {
        this.paidAt = paidAt;
    }

    public LocalDate getWaivedAt() {
        return waivedAt;
    }

    public void setWaivedAt(LocalDate waivedAt) {
        this.waivedAt = waivedAt;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
