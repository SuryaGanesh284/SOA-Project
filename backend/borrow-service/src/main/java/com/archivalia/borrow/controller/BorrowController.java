package com.archivalia.borrow.controller;

import com.archivalia.borrow.dto.BorrowRequest;
import com.archivalia.borrow.dto.BorrowResponse;
import com.archivalia.borrow.service.BorrowService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/borrows")
public class BorrowController {

    private final BorrowService borrowService;

    public BorrowController(BorrowService borrowService) {
        this.borrowService = borrowService;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<BorrowResponse> borrowBook(@Valid @RequestBody BorrowRequest request, Authentication authentication) {
        String username = authentication.getName();
        BorrowResponse response = borrowService.borrowBook(request, username);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/return")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<BorrowResponse> returnBook(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        BorrowResponse response = borrowService.returnBook(id, username);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Page<BorrowResponse>> getBorrowHistory(Pageable pageable, Authentication authentication) {
        String username = authentication.getName();
        Page<BorrowResponse> response = borrowService.getBorrowHistory(username, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<BorrowResponse> getBorrowById(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        BorrowResponse response = borrowService.getBorrowById(id, username, isAdmin);
        return ResponseEntity.ok(response);
    }
}
