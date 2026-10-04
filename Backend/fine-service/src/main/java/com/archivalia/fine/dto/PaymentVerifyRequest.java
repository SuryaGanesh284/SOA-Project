package com.archivalia.fine.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PaymentVerifyRequest {

    @NotNull(message = "Fine ID is required")
    private Long fineId;

    @NotBlank(message = "Order ID is required")
    private String orderId;

    @NotBlank(message = "Payment ID is required")
    private String paymentId;

    private String signature;

    public PaymentVerifyRequest() {
    }

    public PaymentVerifyRequest(Long fineId, String orderId, String paymentId, String signature) {
        this.fineId = fineId;
        this.orderId = orderId;
        this.paymentId = paymentId;
        this.signature = signature;
    }

    public Long getFineId() {
        return fineId;
    }

    public void setFineId(Long fineId) {
        this.fineId = fineId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }
}
