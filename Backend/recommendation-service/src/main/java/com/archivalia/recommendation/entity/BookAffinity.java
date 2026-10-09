package com.archivalia.recommendation.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "book_affinities")
public class BookAffinity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "book_title", nullable = false, unique = true, length = 255)
    private String bookTitle;

    @Column(name = "author", nullable = false, length = 255)
    private String author;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "tags", length = 500)
    private String tags;

    @Column(name = "rating")
    private Integer rating = 5;

    @Column(name = "swatch", length = 100)
    private String swatch;

    @Column(name = "popularity_score")
    private Double popularityScore = 8.0;

    @Column(name = "description", length = 1000)
    private String description;

    public BookAffinity() {}

    public BookAffinity(String bookTitle, String author, String category, String tags, Integer rating, String swatch, Double popularityScore, String description) {
        this.bookTitle = bookTitle;
        this.author = author;
        this.category = category;
        this.tags = tags;
        this.rating = rating;
        this.swatch = swatch;
        this.popularityScore = popularityScore;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBookTitle() {
        return bookTitle;
    }

    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
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

    public Double getPopularityScore() {
        return popularityScore;
    }

    public void setPopularityScore(Double popularityScore) {
        this.popularityScore = popularityScore;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
