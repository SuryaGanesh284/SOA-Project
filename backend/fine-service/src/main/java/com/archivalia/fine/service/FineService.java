package com.archivalia.fine.service;

import com.archivalia.fine.dto.DashboardResponse;
import com.archivalia.fine.dto.FineResponse;
import com.archivalia.fine.entity.Fine;
import com.archivalia.fine.entity.FineStatus;
import com.archivalia.fine.exception.ResourceNotFoundException;
import com.archivalia.fine.repository.FineRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class FineService {

    private final FineRepository fineRepository;

    public FineService(FineRepository fineRepository) {
        this.fineRepository = fineRepository;
    }

    public FineResponse getFineById(Long id, String userId, boolean isAdmin) {
        Fine fine = fineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fine not found"));

        if (!isAdmin && !fine.getUserId().equals(userId)) {
            throw new AccessDeniedException("You do not have permission to view this fine");
        }

        return mapToResponse(fine);
    }

    public Page<FineResponse> getMyFines(String userId, Pageable pageable) {
        return fineRepository.findByUserId(userId, pageable).map(this::mapToResponse);
    }

    public Page<FineResponse> getMyOutstandingFines(String userId, Pageable pageable) {
        List<FineStatus> outstandingStatuses = List.of(FineStatus.PENDING, FineStatus.PARTIALLY_PAID);
        return fineRepository.findByUserIdAndStatusIn(userId, outstandingStatuses, pageable).map(this::mapToResponse);
    }

    public Page<FineResponse> getAllFines(String userId, FineStatus status, Pageable pageable) {
        if (userId != null && status != null) {
            return fineRepository.findByUserIdAndStatus(userId, status, pageable).map(this::mapToResponse);
        } else if (userId != null) {
            return fineRepository.findByUserId(userId, pageable).map(this::mapToResponse);
        } else if (status != null) {
            return fineRepository.findByStatus(status, pageable).map(this::mapToResponse);
        } else {
            return fineRepository.findAll(pageable).map(this::mapToResponse);
        }
    }

    public DashboardResponse getDashboardMetrics() {
        long totalFines = fineRepository.count();
        BigDecimal totalAmount = fineRepository.sumTotalAmount();
        BigDecimal pendingAmount = fineRepository.sumAmountByStatus(FineStatus.PENDING);
        BigDecimal paidAmount = fineRepository.sumAmountByStatus(FineStatus.PAID);
        BigDecimal waivedAmount = fineRepository.sumAmountByStatus(FineStatus.WAIVED);
        BigDecimal outstandingAmount = fineRepository.sumAmountByStatuses(List.of(FineStatus.PENDING, FineStatus.PARTIALLY_PAID));

        return DashboardResponse.builder()
                .totalFines(totalFines)
                .totalAmount(totalAmount)
                .pendingAmount(pendingAmount)
                .paidAmount(paidAmount)
                .waivedAmount(waivedAmount)
                .outstandingAmount(outstandingAmount)
                .build();
    }

    private FineResponse mapToResponse(Fine fine) {
        return FineResponse.builder()
                .id(fine.getId())
                .borrowId(fine.getBorrowId())
                .userId(fine.getUserId())
                .amount(fine.getAmount())
                .reason(fine.getReason())
                .status(fine.getStatus())
                .createdAt(fine.getCreatedAt())
                .build();
    }
}
