package com.archivalia.fine.dto;

public class PaymentOrderDto {

    private String orderId;
    private Long fineId;
    private Integer amount;
    private String currency;
    private String keyId;
    private String status;

    public PaymentOrderDto() {
    }

    public PaymentOrderDto(String orderId, Long fineId, Integer amount, String currency, String keyId, String status) {
        this.orderId = orderId;
        this.fineId = fineId;
        this.amount = amount;
        this.currency = currency;
        this.keyId = keyId;
        this.status = status;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public Long getFineId() {
        return fineId;
    }

    public void setFineId(Long fineId) {
        this.fineId = fineId;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getKeyId() {
        return keyId;
    }

    public void setKeyId(String keyId) {
        this.keyId = keyId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
