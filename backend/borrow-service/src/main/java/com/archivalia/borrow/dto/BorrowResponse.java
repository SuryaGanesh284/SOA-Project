package com.archivalia.borrow.dto;

import com.archivalia.borrow.entity.BorrowStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BorrowResponse {
    private Long id;
    private String username;
    private Long bookId;
    private LocalDateTime borrowedAt;
    private LocalDateTime dueAt;
    private LocalDateTime returnedAt;
    private BorrowStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
