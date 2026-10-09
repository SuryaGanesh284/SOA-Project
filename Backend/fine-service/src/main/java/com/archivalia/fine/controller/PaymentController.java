package com.archivalia.fine.controller;

import com.archivalia.fine.dto.FineDto;
import com.archivalia.fine.dto.PaymentOrderDto;
import com.archivalia.fine.dto.PaymentVerifyRequest;
import com.archivalia.fine.service.FineService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final FineService fineService;

    public PaymentController(FineService fineService) {
        this.fineService = fineService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<PaymentOrderDto> createOrder(@RequestBody Map<String, Object> body) {
        Object fineIdObj = body.get("fineId");
        if (fineIdObj == null) {
            throw new IllegalArgumentException("fineId is required");
        }
        Long fineId = Long.valueOf(fineIdObj.toString());
        return ResponseEntity.ok(fineService.createPaymentOrder(fineId));
    }

    @PostMapping("/verify")
    public ResponseEntity<FineDto> verifyPayment(@Valid @RequestBody PaymentVerifyRequest request) {
        return ResponseEntity.ok(fineService.verifyPayment(request));
    }
}
