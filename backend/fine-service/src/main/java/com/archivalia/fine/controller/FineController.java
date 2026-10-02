package com.archivalia.fine.controller;

import com.archivalia.fine.dto.DashboardResponse;
import com.archivalia.fine.dto.FineResponse;
import com.archivalia.fine.entity.FineStatus;
import com.archivalia.fine.service.FineService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fines")
public class FineController {

    private final FineService fineService;

    public FineController(FineService fineService) {
        this.fineService = fineService;
    }

    @GetMapping("/{fineId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<FineResponse> getFine(@PathVariable Long fineId, Authentication authentication) {
        String userId = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_ADMIN"));
        
        FineResponse response = fineService.getFineById(fineId, userId, isAdmin);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<FineResponse>> getMyFines(Authentication authentication, Pageable pageable) {
        String userId = authentication.getName();
        Page<FineResponse> response = fineService.getMyFines(userId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me/outstanding")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<FineResponse>> getMyOutstandingFines(Authentication authentication, Pageable pageable) {
        String userId = authentication.getName();
        Page<FineResponse> response = fineService.getMyOutstandingFines(userId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<FineResponse>> getAllFines(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) FineStatus status,
            Pageable pageable) {
        Page<FineResponse> response = fineService.getAllFines(userId, status, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardResponse> getDashboardMetrics() {
        DashboardResponse response = fineService.getDashboardMetrics();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{fineId}/waive")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FineResponse> waiveFine(@PathVariable Long fineId) {
        FineResponse response = fineService.waiveFine(fineId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{fineId}/adjust")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FineResponse> adjustFine(
            @PathVariable Long fineId,
            @RequestBody com.archivalia.fine.dto.FineAdjustRequest request) {
        FineResponse response = fineService.adjustFine(fineId, request);
        return ResponseEntity.ok(response);
    }
}
