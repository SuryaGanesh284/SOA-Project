package com.archivalia.book.controller;

import com.archivalia.book.dto.BookDto;
import com.archivalia.book.dto.BookUpsertRequest;
import com.archivalia.book.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/v1/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public ResponseEntity<List<BookDto>> getBooks(
            @RequestParam(name = "q", required = false) String q,
            @RequestParam(name = "format", required = false) String format,
            @RequestParam(name = "section", required = false) String section) {
        String filterFormat = format != null ? format : section;
        List<BookDto> books = bookService.getAllBooks(q, filterFormat);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDto> getBookById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @GetMapping("/by-title/{title}")
    public ResponseEntity<BookDto> getBookByTitle(@PathVariable("title") String title) {
        String decoded = URLDecoder.decode(title, StandardCharsets.UTF_8);
        return ResponseEntity.ok(bookService.getBookByTitle(decoded));
    }

    @PostMapping
    public ResponseEntity<BookDto> createOrUpdateBook(@Valid @RequestBody BookUpsertRequest request) {
        BookDto book = bookService.createOrUpdateBook(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(book);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookDto> updateBook(
            @PathVariable("id") Long id,
            @Valid @RequestBody BookUpsertRequest request) {
        return ResponseEntity.ok(bookService.updateBook(id, request));
    }
}
