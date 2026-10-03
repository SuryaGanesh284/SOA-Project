package com.archivalia.fine.dto;

import com.archivalia.fine.entity.FineStatus;
import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FineCalculationResponse {
    private Long fineId;
    private Long borrowId;
    private String userId;
    private long overdueDays;
    private BigDecimal amount;
    private FineStatus status;
    private String reason;
    private String message;
}
