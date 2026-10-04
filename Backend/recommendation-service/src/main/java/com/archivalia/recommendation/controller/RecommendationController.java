package com.archivalia.recommendation.controller;

import com.archivalia.recommendation.dto.RecommendationDto;
import com.archivalia.recommendation.dto.UserPreferenceDto;
import com.archivalia.recommendation.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    /**
     * Get personalized recommendations for the currently active user
     */
    @GetMapping("/me")
    public ResponseEntity<List<RecommendationDto>> getMyRecommendations(
            @RequestParam(required = false, defaultValue = "USR-101") String userId,
            @RequestParam(required = false, defaultValue = "6") int limit) {
        return ResponseEntity.ok(recommendationService.getRecommendationsForUser(userId, limit));
    }

    /**
     * Get recommendations for a specific user ID
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecommendationDto>> getUserRecommendations(
            @PathVariable String userId,
            @RequestParam(required = false, defaultValue = "6") int limit) {
        return ResponseEntity.ok(recommendationService.getRecommendationsForUser(userId, limit));
    }

    /**
     * Get books similar to a given title
     */
    @GetMapping("/similar")
    public ResponseEntity<List<RecommendationDto>> getSimilarBooks(
            @RequestParam String title,
            @RequestParam(required = false, defaultValue = "4") int limit) {
        return ResponseEntity.ok(recommendationService.getSimilarBooks(title, limit));
    }

    /**
     * Get overall trending / top rated books
     */
    @GetMapping("/trending")
    public ResponseEntity<List<RecommendationDto>> getTrendingBooks(
            @RequestParam(required = false, defaultValue = "5") int limit) {
        return ResponseEntity.ok(recommendationService.getTrendingRecommendations(limit));
    }

    /**
     * Get user preferences
     */
    @GetMapping("/preferences/me")
    public ResponseEntity<UserPreferenceDto> getMyPreferences(
            @RequestParam(required = false, defaultValue = "USR-101") String userId) {
        return ResponseEntity.ok(recommendationService.getUserPreferences(userId));
    }

    /**
     * Save or update user preferences
     */
    @PostMapping("/preferences")
    public ResponseEntity<UserPreferenceDto> savePreferences(@RequestBody UserPreferenceDto dto) {
        return ResponseEntity.ok(recommendationService.saveUserPreferences(dto));
    }
}
