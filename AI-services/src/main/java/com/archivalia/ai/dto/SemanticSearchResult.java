package com.archivalia.ai.dto;

import java.util.List;

public class SemanticSearchResult {

    private String title;
    private String author;
    private int matchScore;
    private String relevanceExplanation;
    private List<String> keyTopicsMatched;
    private String recommendedChapters;
    private String swatch;

    public SemanticSearchResult() {}

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

    public int getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(int matchScore) {
        this.matchScore = matchScore;
    }

    public String getRelevanceExplanation() {
        return relevanceExplanation;
    }

    public void setRelevanceExplanation(String relevanceExplanation) {
        this.relevanceExplanation = relevanceExplanation;
    }

    public List<String> getKeyTopicsMatched() {
        return keyTopicsMatched;
    }

    public void setKeyTopicsMatched(List<String> keyTopicsMatched) {
        this.keyTopicsMatched = keyTopicsMatched;
    }

    public String getRecommendedChapters() {
        return recommendedChapters;
    }

    public void setRecommendedChapters(String recommendedChapters) {
        this.recommendedChapters = recommendedChapters;
    }

    public String getSwatch() {
        return swatch;
    }

    public void setSwatch(String swatch) {
        this.swatch = swatch;
    }
}
