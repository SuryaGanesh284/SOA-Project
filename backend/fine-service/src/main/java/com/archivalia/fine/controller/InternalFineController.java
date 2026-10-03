package com.archivalia.fine.controller;

import com.archivalia.fine.dto.FineCalculationRequest;
import com.archivalia.fine.dto.FineCalculationResponse;
import com.archivalia.fine.service.FineCalculationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/internal/fines")
public class InternalFineController {

    private final FineCalculationService fineCalculationService;

    public InternalFineController(FineCalculationService fineCalculationService) {
        this.fineCalculationService = fineCalculationService;
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/calculate")
    public ResponseEntity<FineCalculationResponse> calculateFine(@RequestBody FineCalculationRequest request) {
        FineCalculationResponse response = fineCalculationService.calculateFine(request);
        return ResponseEntity.ok(response);
    }
}
