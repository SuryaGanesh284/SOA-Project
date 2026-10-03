package com.archivalia.fine.service;

import com.archivalia.fine.dto.FineCalculationRequest;
import com.archivalia.fine.dto.FineCalculationResponse;
import com.archivalia.fine.entity.Fine;
import com.archivalia.fine.entity.FineStatus;
import com.archivalia.fine.repository.FineRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class FineCalculationService {

    private final FineRepository fineRepository;
    private final BigDecimal perDayRate;

    public FineCalculationService(FineRepository fineRepository,
                                  @Value("${app.fine.per-day-rate:10.0}") BigDecimal perDayRate) {
        this.fineRepository = fineRepository;
        this.perDayRate = perDayRate;
    }

    @Transactional
    public FineCalculationResponse calculateFine(FineCalculationRequest request) {
        if (request.getBorrowId() == null || request.getUserId() == null ||
            request.getDueAt() == null || request.getReturnedAt() == null) {
            throw new IllegalArgumentException("Missing required fields for fine calculation");
        }

        if (request.getReturnedAt().isBefore(request.getDueAt()) || request.getReturnedAt().isEqual(request.getDueAt())) {
            return FineCalculationResponse.builder()
                    .borrowId(request.getBorrowId())
                    .userId(request.getUserId())
                    .overdueDays(0)
                    .amount(BigDecimal.ZERO)
                    .message("Resource returned on time. No fine applicable.")
                    .build();
        }

        Optional<Fine> existingFine = fineRepository.findByBorrowId(request.getBorrowId());
        if (existingFine.isPresent()) {
            Fine fine = existingFine.get();
            long days = ChronoUnit.DAYS.between(request.getDueAt().toLocalDate(), request.getReturnedAt().toLocalDate());
            if (days <= 0) days = 1;
            return FineCalculationResponse.builder()
                    .fineId(fine.getId())
                    .borrowId(fine.getBorrowId())
                    .userId(fine.getUserId())
                    .overdueDays(days)
                    .amount(fine.getAmount())
                    .status(fine.getStatus())
                    .reason(fine.getReason())
                    .message("Fine already exists for this borrow transaction.")
                    .build();
        }

        long overdueDays = ChronoUnit.DAYS.between(request.getDueAt().toLocalDate(), request.getReturnedAt().toLocalDate());
        if (overdueDays <= 0) {
            overdueDays = 1; 
        }

        BigDecimal fineAmount = perDayRate.multiply(BigDecimal.valueOf(overdueDays));

        Fine fine = new Fine();
        fine.setBorrowId(request.getBorrowId());
        fine.setUserId(request.getUserId());
        fine.setAmount(fineAmount);
        fine.setReason(String.format("Overdue by %d days", overdueDays));
        fine.setStatus(FineStatus.PENDING);
        
        fine = fineRepository.save(fine);

        return FineCalculationResponse.builder()
                .fineId(fine.getId())
                .borrowId(fine.getBorrowId())
                .userId(fine.getUserId())
                .overdueDays(overdueDays)
                .amount(fine.getAmount())
                .status(fine.getStatus())
                .reason(fine.getReason())
                .message("Overdue fine calculated and created.")
                .build();
    }
}
