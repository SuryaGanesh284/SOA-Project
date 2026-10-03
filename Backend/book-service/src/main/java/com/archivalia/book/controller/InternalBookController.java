package com.archivalia.book.controller;

import com.archivalia.book.dto.BookCopyDto;
import com.archivalia.book.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/internal/copies")
public class InternalBookController {

    private final BookService bookService;

    public InternalBookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/{code}")
    public ResponseEntity<BookCopyDto> getCopy(@PathVariable("code") String code) {
        return ResponseEntity.ok(bookService.getCopyByCode(code));
    }

    @PostMapping("/{code}/borrow")
    public ResponseEntity<BookCopyDto> borrowCopy(@PathVariable("code") String code) {
        return ResponseEntity.ok(bookService.borrowCopy(code));
    }

    @PostMapping("/{code}/release")
    public ResponseEntity<BookCopyDto> releaseCopy(@PathVariable("code") String code) {
        return ResponseEntity.ok(bookService.releaseCopy(code));
    }
}
