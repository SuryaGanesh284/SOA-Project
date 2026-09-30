package com.archivalia.fine.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class DashboardResponse {
    private long totalFines;
    private BigDecimal totalAmount;
    private BigDecimal pendingAmount;
    private BigDecimal paidAmount;
    private BigDecimal waivedAmount;
    private BigDecimal outstandingAmount;
}
