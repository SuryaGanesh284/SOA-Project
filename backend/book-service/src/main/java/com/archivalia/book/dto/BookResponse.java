package com.archivalia.book.dto;

import com.archivalia.book.entity.Book;
import java.time.LocalDateTime;

public class BookResponse {
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private String category;
    private String description;
    private Integer totalCopies;
    private Integer availableCopies;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BookResponse(Book book) {
        this.id = book.getId();
        this.title = book.getTitle();
        this.author = book.getAuthor();
        this.isbn = book.getIsbn();
        this.category = book.getCategory();
        this.description = book.getDescription();
        this.totalCopies = book.getTotalCopies();
        this.availableCopies = book.getAvailableCopies();
        this.createdAt = book.getCreatedAt();
        this.updatedAt = book.getUpdatedAt();
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public String getIsbn() { return isbn; }
    public String getCategory() { return category; }
    public String getDescription() { return description; }
    public Integer getTotalCopies() { return totalCopies; }
    public Integer getAvailableCopies() { return availableCopies; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
