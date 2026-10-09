package com.archivalia.borrow.controller;

import com.archivalia.borrow.dto.BorrowRequest;
import com.archivalia.borrow.dto.LoanDto;
import com.archivalia.borrow.service.BorrowService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/borrows")
public class BorrowController {

    private final BorrowService borrowService;

    public BorrowController(BorrowService borrowService) {
        this.borrowService = borrowService;
    }

    @GetMapping
    public ResponseEntity<List<LoanDto>> getAllLoans() {
        return ResponseEntity.ok(borrowService.getAllLoans());
    }

    @GetMapping("/my")
    public ResponseEntity<List<LoanDto>> getMyLoans(
            @RequestHeader(name = "X-User-Id", required = false) String userIdHeader,
            @RequestParam(name = "userId", required = false) String userIdParam) {
        String userId = (userIdParam != null && !userIdParam.trim().isEmpty())
                ? userIdParam : ((userIdHeader != null && !userIdHeader.trim().isEmpty()) ? userIdHeader : "USR-101");
        return ResponseEntity.ok(borrowService.getUserLoans(userId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LoanDto>> getUserLoans(@PathVariable("userId") String userId) {
        return ResponseEntity.ok(borrowService.getUserLoans(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanDto> getLoanById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(borrowService.getLoanById(id));
    }

    @PostMapping
    public ResponseEntity<LoanDto> borrowBook(@Valid @RequestBody BorrowRequest request) {
        LoanDto loan = borrowService.borrowBook(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(loan);
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<LoanDto> returnBookPost(@PathVariable("id") Long id) {
        return ResponseEntity.ok(borrowService.returnBook(id));
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<LoanDto> returnBookPut(@PathVariable("id") Long id) {
        return ResponseEntity.ok(borrowService.returnBook(id));
    }
}
