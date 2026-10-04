package com.archivalia.fine.service;

import com.archivalia.fine.dto.CreateFineRequest;
import com.archivalia.fine.dto.FineDto;
import com.archivalia.fine.dto.PaymentOrderDto;
import com.archivalia.fine.dto.PaymentVerifyRequest;
import com.archivalia.fine.entity.Fine;
import com.archivalia.fine.entity.FineStatus;
import com.archivalia.fine.entity.PaymentOrder;
import com.archivalia.fine.repository.FineRepository;
import com.archivalia.fine.repository.PaymentOrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Transactional
public class FineService {

    private static final Logger log = LoggerFactory.getLogger(FineService.class);
    private static final String RAZORPAY_SANDBOX_KEY_ID = "rzp_test_archivalia2026";

    private final FineRepository fineRepository;
    private final PaymentOrderRepository paymentOrderRepository;

    public FineService(FineRepository fineRepository, PaymentOrderRepository paymentOrderRepository) {
        this.fineRepository = fineRepository;
        this.paymentOrderRepository = paymentOrderRepository;
    }

    @Transactional(readOnly = true)
    public List<FineDto> getAllFines() {
        return fineRepository.findAllByOrderByIssuedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FineDto> getUserFines(String userId) {
        String targetId = (userId != null && !userId.trim().isEmpty()) ? userId.trim() : "USR-101";
        return fineRepository.findByUserIdOrderByIssuedAtDesc(targetId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FineDto getFineById(Long id) {
        Fine fine = fineRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Fine not found with id: " + id));
        return toDto(fine);
    }

    public FineDto createFine(CreateFineRequest request) {
        String fineCode = "fine-" + System.currentTimeMillis();
        Fine fine = new Fine(
                fineCode,
                request.getLoanId(),
                request.getUserId() != null ? request.getUserId() : "USR-101",
                request.getUserName() != null ? request.getUserName() : "Ben Bradle",
                request.getUserEmail() != null ? request.getUserEmail() : "user@archivalia.test",
                request.getTitle(),
                request.getAmount(),
                request.getReason(),
                LocalDate.now()
        );
        Fine saved = fineRepository.save(fine);
        log.info("Created new fine {} for user {} amount ₹{}", fineCode, fine.getUserId(), fine.getAmount());
        return toDto(saved);
    }

    public FineDto payFine(Long id, String paymentReference, String paymentMethod) {
        Fine fine = fineRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Fine not found with id: " + id));

        if (fine.getStatus() == FineStatus.PAID) {
            return toDto(fine);
        }

        fine.setStatus(FineStatus.PAID);
        fine.setPaidAt(LocalDate.now());
        fine.setPaymentReference(paymentReference != null ? paymentReference : "pay_mock_" + System.currentTimeMillis());
        fine.setPaymentMethod(paymentMethod != null ? paymentMethod : "RAZORPAY_SANDBOX");

        Fine saved = fineRepository.save(fine);
        log.info("Recorded payment for fine id {} reference {}", id, fine.getPaymentReference());
        return toDto(saved);
    }

    public FineDto waiveFine(Long id, String reason) {
        Fine fine = fineRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Fine not found with id: " + id));

        fine.setStatus(FineStatus.WAIVED);
        fine.setWaivedAt(LocalDate.now());
        fine.setPaymentMethod("WAIVED");
        if (reason != null && !reason.trim().isEmpty()) {
            fine.setReason((fine.getReason() != null ? fine.getReason() + " | " : "") + "Waived: " + reason.trim());
        }

        Fine saved = fineRepository.save(fine);
        log.info("Waived fine id {} by admin", id);
        return toDto(saved);
    }

    public PaymentOrderDto createPaymentOrder(Long fineId) {
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new NoSuchElementException("Fine not found with id: " + fineId));

        if (fine.getStatus() != FineStatus.PENDING) {
            throw new IllegalStateException("Fine is already " + fine.getStatus());
        }

        String orderId = "order_sand_" + System.currentTimeMillis();
        PaymentOrder order = new PaymentOrder(orderId, fineId, fine.getAmount(), "INR");
        paymentOrderRepository.save(order);

        log.info("Created Razorpay Sandbox Order {} for fine id {}", orderId, fineId);
        return new PaymentOrderDto(orderId, fineId, fine.getAmount(), "INR", RAZORPAY_SANDBOX_KEY_ID, "CREATED");
    }

    public FineDto verifyPayment(PaymentVerifyRequest req) {
        PaymentOrder order = paymentOrderRepository.findByOrderId(req.getOrderId())
                .orElseThrow(() -> new NoSuchElementException("Payment order not found: " + req.getOrderId()));

        order.setStatus("SUCCESS");
        order.setPaymentId(req.getPaymentId());
        paymentOrderRepository.save(order);

        return payFine(req.getFineId(), req.getPaymentId(), "RAZORPAY_SANDBOX");
    }

    public FineDto toDto(Fine fine) {
        return new FineDto(
                fine.getId(),
                fine.getFineCode(),
                fine.getLoanId(),
                fine.getUserId(),
                fine.getUserName(),
                fine.getTitle(),
                fine.getAmount(),
                fine.getReason(),
                fine.getStatus().name(),
                fine.getIssuedAt() != null ? fine.getIssuedAt().toString() : null,
                fine.getPaidAt() != null ? fine.getPaidAt().toString() : null,
                fine.getPaymentReference()
        );
    }
}
