package com.archivalia.fine.dto;

import com.archivalia.fine.entity.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentVerifyResponse {
    private Long fineId;
    private Long paymentId;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private BigDecimal amount;
    private PaymentStatus status;
    private LocalDateTime paidAt;
}
