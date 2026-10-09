package com.archivalia.recommendation.dto;

import java.util.List;

public class RecommendationDto {
    private String title;
    private String author;
    private Integer rating;
    private String swatch;
    private String category;
    private String reason;
    private Double affinityScore;
    private List<String> tags;

    public RecommendationDto() {}

    public RecommendationDto(String title, String author, Integer rating, String swatch, String category, String reason, Double affinityScore, List<String> tags) {
        this.title = title;
        this.author = author;
        this.rating = rating;
        this.swatch = swatch;
        this.category = category;
        this.reason = reason;
        this.affinityScore = affinityScore;
        this.tags = tags;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Double getAffinityScore() {
        return affinityScore;
    }

    public void setAffinityScore(Double affinityScore) {
        this.affinityScore = affinityScore;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}
