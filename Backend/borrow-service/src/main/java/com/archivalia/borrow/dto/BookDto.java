package com.archivalia.borrow.dto;

import java.util.List;

public class BookDto {

    private Long id;
    private String title;
    private String author;
    private Integer year;
    private Integer rating;
    private String swatch;
    private List<String> groups;
    private String description;
    private List<BookCopyDto> copies;

    public BookDto() {
    }

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

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
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

    public List<String> getGroups() {
        return groups;
    }

    public void setGroups(List<String> groups) {
        this.groups = groups;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<BookCopyDto> getCopies() {
        return copies;
    }

    public void setCopies(List<BookCopyDto> copies) {
        this.copies = copies;
    }
}
