package com.archivalia.fine.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FineCalculationRequest {
    private Long borrowId;
    private String userId;
    private LocalDateTime dueAt;
    private LocalDateTime returnedAt;
}
