package com.archivalia.book.controller;

import com.archivalia.book.dto.BookCopyDto;
import com.archivalia.book.entity.CopyStatus;
import com.archivalia.book.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/copies")
public class CopyController {

    private final BookService bookService;

    public CopyController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public ResponseEntity<List<BookCopyDto>> getAllCopies() {
        return ResponseEntity.ok(bookService.getAllCopies());
    }

    @GetMapping("/{code}")
    public ResponseEntity<BookCopyDto> getCopyByCode(@PathVariable("code") String code) {
        return ResponseEntity.ok(bookService.getCopyByCode(code));
    }

    @PutMapping("/{code}/status")
    public ResponseEntity<BookCopyDto> updateCopyStatus(
            @PathVariable("code") String code,
            @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        if (statusStr == null) {
            throw new IllegalArgumentException("Status field is required");
        }
        CopyStatus status = CopyStatus.valueOf(statusStr.toUpperCase());
        return ResponseEntity.ok(bookService.updateCopyStatus(code, status));
    }
}
