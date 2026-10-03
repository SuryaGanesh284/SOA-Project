package com.archivalia.book.controller;

import com.archivalia.book.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/internal/books")
public class InternalBookController {

    private final BookService bookService;

    public InternalBookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PostMapping("/{id}/reserve")
    public ResponseEntity<Void> reserveBook(@PathVariable Long id) {
        bookService.reserveBook(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/release")
    public ResponseEntity<Void> releaseBook(@PathVariable Long id) {
        bookService.releaseBook(id);
        return ResponseEntity.ok().build();
    }
}
