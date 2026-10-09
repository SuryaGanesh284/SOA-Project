package com.archivalia.fine.controller;

import com.archivalia.fine.dto.CreateFineRequest;
import com.archivalia.fine.dto.FineDto;
import com.archivalia.fine.service.FineService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/fines")
public class FineController {

    private final FineService fineService;

    public FineController(FineService fineService) {
        this.fineService = fineService;
    }

    @GetMapping
    public ResponseEntity<List<FineDto>> getAllFines() {
        return ResponseEntity.ok(fineService.getAllFines());
    }

    @GetMapping("/my")
    public ResponseEntity<List<FineDto>> getMyFines(
            @RequestParam(name = "userId", required = false) String userIdParam,
            @RequestHeader(name = "X-User-Id", required = false) String userIdHeader) {
        String userId = (userIdParam != null && !userIdParam.trim().isEmpty())
                ? userIdParam : ((userIdHeader != null && !userIdHeader.trim().isEmpty()) ? userIdHeader : "USR-101");
        return ResponseEntity.ok(fineService.getUserFines(userId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FineDto>> getUserFines(@PathVariable("userId") String userId) {
        return ResponseEntity.ok(fineService.getUserFines(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FineDto> getFineById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(fineService.getFineById(id));
    }

    @PostMapping
    public ResponseEntity<FineDto> createFine(@Valid @RequestBody CreateFineRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fineService.createFine(request));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<FineDto> payFinePost(
            @PathVariable("id") Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String reference = body != null ? body.get("reference") : null;
        String method = body != null ? body.get("method") : "RAZORPAY_SANDBOX";
        return ResponseEntity.ok(fineService.payFine(id, reference, method));
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<FineDto> payFinePut(
            @PathVariable("id") Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String reference = body != null ? body.get("reference") : null;
        String method = body != null ? body.get("method") : "RAZORPAY_SANDBOX";
        return ResponseEntity.ok(fineService.payFine(id, reference, method));
    }

    @PostMapping("/{id}/waive")
    public ResponseEntity<FineDto> waiveFinePost(
            @PathVariable("id") Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : null;
        return ResponseEntity.ok(fineService.waiveFine(id, reason));
    }

    @PutMapping("/{id}/waive")
    public ResponseEntity<FineDto> waiveFinePut(
            @PathVariable("id") Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : null;
        return ResponseEntity.ok(fineService.waiveFine(id, reason));
    }
}
