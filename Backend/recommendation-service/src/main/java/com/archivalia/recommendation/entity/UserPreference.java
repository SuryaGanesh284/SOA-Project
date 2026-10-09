package com.archivalia.recommendation.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_preferences")
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true, length = 64)
    private String userId;

    @Column(name = "preferred_categories", length = 500)
    private String preferredCategories;

    @Column(name = "preferred_authors", length = 500)
    private String preferredAuthors;

    @Column(name = "min_rating")
    private Integer minRating = 4;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public UserPreference() {}

    public UserPreference(String userId, String preferredCategories, String preferredAuthors, Integer minRating) {
        this.userId = userId;
        this.preferredCategories = preferredCategories;
        this.preferredAuthors = preferredAuthors;
        this.minRating = minRating;
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPreferredCategories() {
        return preferredCategories;
    }

    public void setPreferredCategories(String preferredCategories) {
        this.preferredCategories = preferredCategories;
    }

    public String getPreferredAuthors() {
        return preferredAuthors;
    }

    public void setPreferredAuthors(String preferredAuthors) {
        this.preferredAuthors = preferredAuthors;
    }

    public Integer getMinRating() {
        return minRating;
    }

    public void setMinRating(Integer minRating) {
        this.minRating = minRating;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
