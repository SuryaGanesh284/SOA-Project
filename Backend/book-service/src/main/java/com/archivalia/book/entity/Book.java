package com.archivalia.book.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String title;

    @Column(nullable = false)
    private String author;

    private Integer publicationYear;

    private Integer rating = 5;

    private String swatch = "from-sky-500 to-blue-900";

    @Column(name = "book_groups")
    private String groups; // comma-separated e.g. "physical,reading-now,quiet"

    @Column(length = 2000)
    private String description;

    private boolean active = true;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<BookCopy> copies = new ArrayList<>();

    public Book() {
    }

    public Book(String title, String author, Integer publicationYear, Integer rating, String swatch, String groups, String description) {
        this.title = title;
        this.author = author;
        this.publicationYear = publicationYear;
        this.rating = rating != null ? rating : 5;
        this.swatch = swatch != null ? swatch : "from-sky-500 to-blue-900";
        this.groups = groups;
        this.description = description;
        this.active = true;
    }

    public void addCopy(String copyCode, CopyStatus status, String location) {
        BookCopy copy = new BookCopy(this, copyCode, status, location);
        this.copies.add(copy);
    }

    public List<String> getGroupsList() {
        if (groups == null || groups.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.asList(groups.split(","));
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Integer getPublicationYear() {
        return publicationYear;
    }

    public void setPublicationYear(Integer publicationYear) {
        this.publicationYear = publicationYear;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getSwatch() {
        return swatch;
    }

    public void setSwatch(String swatch) {
        this.swatch = swatch;
    }

    public String getGroups() {
        return groups;
    }

    public void setGroups(String groups) {
        this.groups = groups;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public List<BookCopy> getCopies() {
        return copies;
    }

    public void setCopies(List<BookCopy> copies) {
        this.copies = copies;
    }
}
