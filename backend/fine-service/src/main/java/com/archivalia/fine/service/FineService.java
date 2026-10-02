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
    private final com.archivalia.fine.repository.PaymentRepository paymentRepository;

    @org.springframework.beans.factory.annotation.Value("${app.razorpay.key-id}")
    private String razorpayKeyId;

    @org.springframework.beans.factory.annotation.Value("${app.razorpay.key-secret}")
    private String razorpayKeySecret;

    public FineService(FineRepository fineRepository, com.archivalia.fine.repository.PaymentRepository paymentRepository) {
        this.fineRepository = fineRepository;
        this.paymentRepository = paymentRepository;
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
    
    @org.springframework.transaction.annotation.Transactional
    public FineResponse waiveFine(Long fineId) {
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new ResourceNotFoundException("Fine not found"));

        fine.setStatus(FineStatus.WAIVED);
        fine.setAmount(BigDecimal.ZERO);
        fine = fineRepository.save(fine);
        return mapToResponse(fine);
    }

    @org.springframework.transaction.annotation.Transactional
    public FineResponse adjustFine(Long fineId, com.archivalia.fine.dto.FineAdjustRequest request) {
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Adjusted amount must be non-negative");
        }

        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new ResourceNotFoundException("Fine not found"));

        fine.setAmount(request.getAmount());

        fine = fineRepository.save(fine);
        return mapToResponse(fine);
    }

    @org.springframework.transaction.annotation.Transactional
    public com.archivalia.fine.dto.PaymentOrderResponse createPaymentOrder(Long fineId, String userId, boolean isAdmin) {
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new ResourceNotFoundException("Fine not found"));

        if (!isAdmin && !fine.getUserId().equals(userId)) {
            throw new AccessDeniedException("You do not have permission to pay this fine");
        }

        if (fine.getStatus() == FineStatus.PAID || fine.getStatus() == FineStatus.WAIVED || fine.getStatus() == FineStatus.CANCELLED) {
            throw new IllegalArgumentException("Fine is not in a payable state");
        }

        if (fine.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Fine amount must be greater than zero");
        }

        try {
            com.razorpay.RazorpayClient razorpay = new com.razorpay.RazorpayClient(razorpayKeyId, razorpayKeySecret);

            org.json.JSONObject orderRequest = new org.json.JSONObject();
            // Convert to paise
            int amountInPaise = fine.getAmount().multiply(new BigDecimal("100")).intValue();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "fine_receipt_" + fineId);

            com.razorpay.Order order = razorpay.orders.create(orderRequest);

            com.archivalia.fine.entity.Payment payment = new com.archivalia.fine.entity.Payment();
            payment.setFineId(fineId);
            payment.setRazorpayOrderId(order.get("id"));
            payment.setAmount(fine.getAmount());
            payment.setStatus(com.archivalia.fine.entity.PaymentStatus.PENDING);

            payment = paymentRepository.save(payment);

            return com.archivalia.fine.dto.PaymentOrderResponse.builder()
                    .fineId(fineId)
                    .paymentId(payment.getId())
                    .razorpayOrderId(payment.getRazorpayOrderId())
                    .amount(payment.getAmount())
                    .currency("INR")
                    .razorpayKeyId(razorpayKeyId)
                    .build();

        } catch (com.razorpay.RazorpayException e) {
            throw new RuntimeException("Error creating Razorpay order: " + e.getMessage(), e);
        }
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
