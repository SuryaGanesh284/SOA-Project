package com.archivalia.recommendation.dto;

import java.util.List;

public class UserPreferenceDto {
    private String userId;
    private List<String> preferredCategories;
    private List<String> preferredAuthors;
    private Integer minRating;

    public UserPreferenceDto() {}

    public UserPreferenceDto(String userId, List<String> preferredCategories, List<String> preferredAuthors, Integer minRating) {
        this.userId = userId;
        this.preferredCategories = preferredCategories;
        this.preferredAuthors = preferredAuthors;
        this.minRating = minRating;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<String> getPreferredCategories() {
        return preferredCategories;
    }

    public void setPreferredCategories(List<String> preferredCategories) {
        this.preferredCategories = preferredCategories;
    }

    public List<String> getPreferredAuthors() {
        return preferredAuthors;
    }

    public void setPreferredAuthors(List<String> preferredAuthors) {
        this.preferredAuthors = preferredAuthors;
    }

    public Integer getMinRating() {
        return minRating;
    }

    public void setMinRating(Integer minRating) {
        this.minRating = minRating;
    }
}
