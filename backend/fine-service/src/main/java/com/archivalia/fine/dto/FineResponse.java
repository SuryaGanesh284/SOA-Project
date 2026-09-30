package com.archivalia.fine.dto;

import com.archivalia.fine.entity.FineStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class FineResponse {
    private Long id;
    private Long borrowId;
    private String userId;
    private BigDecimal amount;
    private String reason;
    private FineStatus status;
    private LocalDateTime createdAt;
}
