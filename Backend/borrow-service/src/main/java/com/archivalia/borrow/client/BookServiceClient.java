package com.archivalia.borrow.client;

import com.archivalia.borrow.dto.BookCopyDto;
import com.archivalia.borrow.dto.BookDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "book-service", url = "${book-service.url:}")
public interface BookServiceClient {

    @GetMapping("/api/v1/books/by-title/{title}")
    BookDto getBookByTitle(@PathVariable("title") String title);

    @PostMapping("/internal/copies/{code}/borrow")
    BookCopyDto borrowCopy(@PathVariable("code") String code);

    @PostMapping("/internal/copies/{code}/release")
    BookCopyDto releaseCopy(@PathVariable("code") String code);

    @GetMapping("/internal/copies/{code}")
    BookCopyDto getCopy(@PathVariable("code") String code);
}
