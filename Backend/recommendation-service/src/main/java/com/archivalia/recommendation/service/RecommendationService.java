package com.archivalia.recommendation.service;

import com.archivalia.recommendation.dto.RecommendationDto;
import com.archivalia.recommendation.dto.UserPreferenceDto;
import com.archivalia.recommendation.entity.BookAffinity;
import com.archivalia.recommendation.entity.UserPreference;
import com.archivalia.recommendation.repository.BookAffinityRepository;
import com.archivalia.recommendation.repository.UserPreferenceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private static final Logger log = LoggerFactory.getLogger(RecommendationService.class);

    private final BookAffinityRepository affinityRepository;
    private final UserPreferenceRepository preferenceRepository;
    private final RestClient restClient;

    public RecommendationService(BookAffinityRepository affinityRepository,
                                 UserPreferenceRepository preferenceRepository,
                                 RestClient restClient) {
        this.affinityRepository = affinityRepository;
        this.preferenceRepository = preferenceRepository;
        this.restClient = restClient;
    }

    public List<RecommendationDto> getRecommendationsForUser(String userId, int limit) {
        List<BookAffinity> allBooks = affinityRepository.findAll();
        if (allBooks.isEmpty()) {
            return Collections.emptyList();
        }

        // Fetch user preferences if available
        Optional<UserPreference> userPrefOpt = (userId != null && !userId.isBlank())
                ? preferenceRepository.findByUserId(userId)
                : Optional.empty();

        // Fetch user borrowing history
        List<String> borrowedTitles = getBorrowedTitlesForUser(userId);
        List<BookAffinity> borrowedAffinities = borrowedTitles.stream()
                .map(t -> affinityRepository.findByBookTitleIgnoreCase(t).orElse(null))
                .filter(Objects::nonNull)
                .toList();

        // Parse user preferences
        Set<String> preferredCats = new HashSet<>();
        Set<String> preferredAuthors = new HashSet<>();
        int minRating = 1;

        if (userPrefOpt.isPresent()) {
            UserPreference pref = userPrefOpt.get();
            if (pref.getPreferredCategories() != null) {
                Arrays.stream(pref.getPreferredCategories().split(","))
                        .map(String::trim)
                        .map(String::toLowerCase)
                        .forEach(preferredCats::add);
            }
            if (pref.getPreferredAuthors() != null) {
                Arrays.stream(pref.getPreferredAuthors().split(","))
                        .map(String::trim)
                        .map(String::toLowerCase)
                        .forEach(preferredAuthors::add);
            }
            if (pref.getMinRating() != null) {
                minRating = pref.getMinRating();
            }
        }

        // Score each book
        final int filterMinRating = minRating;
        List<ScoredBook> scoredBooks = new ArrayList<>();

        for (BookAffinity book : allBooks) {
            double score = (book.getPopularityScore() != null ? book.getPopularityScore() : 7.0);
            score += (book.getRating() != null ? book.getRating() * 3.0 : 12.0);

            String reason = null;
            boolean alreadyBorrowed = borrowedTitles.stream().anyMatch(t -> t.equalsIgnoreCase(book.getBookTitle()));

            if (alreadyBorrowed) {
                score -= 30.0; // De-prioritize already borrowed items
            }

            // Affinity with borrowed books
            for (BookAffinity borrowed : borrowedAffinities) {
                if (borrowed.getAuthor() != null && borrowed.getAuthor().equalsIgnoreCase(book.getAuthor())) {
                    score += 35.0;
                    if (reason == null) reason = "Because you borrowed works by " + book.getAuthor();
                }
                if (borrowed.getCategory() != null && borrowed.getCategory().equalsIgnoreCase(book.getCategory())) {
                    score += 25.0;
                    if (reason == null) reason = "Because you borrowed " + borrowed.getBookTitle();
                }

                // Tag overlap
                Set<String> borrowedTags = parseTags(borrowed.getTags());
                Set<String> bookTags = parseTags(book.getTags());
                borrowedTags.retainAll(bookTags);
                if (!borrowedTags.isEmpty()) {
                    score += (borrowedTags.size() * 15.0);
                    if (reason == null) {
                        reason = "Matches your interest in " + borrowedTags.iterator().next();
                    }
                }
            }

            // Affinity with explicit preferences
            String bookCat = (book.getCategory() != null) ? book.getCategory().toLowerCase() : "";
            if (preferredCats.contains(bookCat)) {
                score += 30.0;
                if (reason == null) reason = "Aligned with your category preferences";
            }

            String bookAuthor = (book.getAuthor() != null) ? book.getAuthor().toLowerCase() : "";
            if (preferredAuthors.contains(bookAuthor)) {
                score += 35.0;
                if (reason == null) reason = "From your favored author " + book.getAuthor();
            }

            // Fallback rationales for cold-start or unclassified
            if (reason == null) {
                if (book.getRating() != null && book.getRating() >= 5) {
                    reason = "Top-Rated 5.0 Scholar's Choice";
                } else if (book.getPopularityScore() != null && book.getPopularityScore() >= 9.0) {
                    reason = "Trending in Archivalia Academic Library";
                } else {
                    reason = "Recommended for your academic curriculum";
                }
            }

            scoredBooks.add(new ScoredBook(book, score, reason));
        }

        // Sort descending by score
        scoredBooks.sort((a, b) -> Double.compare(b.score, a.score));

        return scoredBooks.stream()
                .limit(limit > 0 ? limit : 6)
                .map(sb -> toDto(sb.book, sb.reason, sb.score))
                .collect(Collectors.toList());
    }

    public List<RecommendationDto> getSimilarBooks(String title, int limit) {
        List<BookAffinity> allBooks = affinityRepository.findAll();
        Optional<BookAffinity> targetOpt = affinityRepository.findByBookTitleIgnoreCase(title);

        if (targetOpt.isEmpty()) {
            return getTrendingRecommendations(limit);
        }

        BookAffinity target = targetOpt.get();
        Set<String> targetTags = parseTags(target.getTags());

        List<ScoredBook> scored = new ArrayList<>();
        for (BookAffinity book : allBooks) {
            if (book.getBookTitle().equalsIgnoreCase(target.getBookTitle())) {
                continue; // Skip self
            }

            double score = (book.getPopularityScore() != null ? book.getPopularityScore() : 5.0);
            String reason = null;

            if (target.getAuthor() != null && target.getAuthor().equalsIgnoreCase(book.getAuthor())) {
                score += 50.0;
                reason = "By the same author (" + target.getAuthor() + ")";
            }

            if (target.getCategory() != null && target.getCategory().equalsIgnoreCase(book.getCategory())) {
                score += 30.0;
                if (reason == null) reason = "Similar category (" + target.getCategory() + ")";
            }

            Set<String> candidateTags = parseTags(book.getTags());
            candidateTags.retainAll(targetTags);
            if (!candidateTags.isEmpty()) {
                score += (candidateTags.size() * 20.0);
                if (reason == null) reason = "Shared topics: " + String.join(", ", candidateTags);
            }

            if (reason == null) {
                reason = "Related academic literature";
            }

            scored.add(new ScoredBook(book, score, reason));
        }

        scored.sort((a, b) -> Double.compare(b.score, a.score));

        return scored.stream()
                .limit(limit > 0 ? limit : 4)
                .map(sb -> toDto(sb.book, sb.reason, sb.score))
                .collect(Collectors.toList());
    }

    public List<RecommendationDto> getTrendingRecommendations(int limit) {
        return affinityRepository.findAllByOrderByPopularityScoreDesc().stream()
                .limit(limit > 0 ? limit : 5)
                .map(b -> toDto(b, "Trending in Archivalia Library", b.getPopularityScore()))
                .collect(Collectors.toList());
    }

    public UserPreferenceDto getUserPreferences(String userId) {
        if (userId == null || userId.isBlank()) {
            return new UserPreferenceDto("anonymous", List.of(), List.of(), 4);
        }

        return preferenceRepository.findByUserId(userId)
                .map(this::toPreferenceDto)
                .orElseGet(() -> new UserPreferenceDto(userId, List.of("ebooks", "physical", "software"), List.of(), 4));
    }

    public UserPreferenceDto saveUserPreferences(UserPreferenceDto dto) {
        String userId = (dto.getUserId() != null && !dto.getUserId().isBlank()) ? dto.getUserId() : "USR-101";

        UserPreference pref = preferenceRepository.findByUserId(userId)
                .orElse(new UserPreference());

        pref.setUserId(userId);
        if (dto.getPreferredCategories() != null) {
            pref.setPreferredCategories(String.join(",", dto.getPreferredCategories()));
        }
        if (dto.getPreferredAuthors() != null) {
            pref.setPreferredAuthors(String.join(",", dto.getPreferredAuthors()));
        }
        if (dto.getMinRating() != null) {
            pref.setMinRating(dto.getMinRating());
        }

        UserPreference saved = preferenceRepository.save(pref);
        return toPreferenceDto(saved);
    }

    private List<String> getBorrowedTitlesForUser(String userId) {
        if (userId == null || userId.isBlank()) {
            return Collections.emptyList();
        }

        try {
            // Query borrow-service directly at port 8083
            List<Map<String, Object>> loans = restClient.get()
                    .uri("http://localhost:8083/api/v1/borrows/user/" + userId)
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {});

            if (loans != null) {
                return loans.stream()
                        .map(loan -> {
                            Object t = loan.get("title");
                            if (t == null) t = loan.get("bookTitle");
                            return t != null ? t.toString() : null;
                        })
                        .filter(Objects::nonNull)
                        .distinct()
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            log.warn("Could not retrieve loans from borrow-service for user {}: {}", userId, e.getMessage());
        }

        // Default fallback borrowing history for demo user USR-101
        if ("USR-101".equalsIgnoreCase(userId)) {
            return List.of("The Design of Everyday Things", "Clean Code");
        }

        return Collections.emptyList();
    }

    private Set<String> parseTags(String tags) {
        if (tags == null || tags.isBlank()) return new HashSet<>();
        return Arrays.stream(tags.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
    }

    private RecommendationDto toDto(BookAffinity b, String reason, Double score) {
        List<String> tagList = (b.getTags() != null)
                ? Arrays.stream(b.getTags().split(",")).map(String::trim).toList()
                : List.of();

        return new RecommendationDto(
                b.getBookTitle(),
                b.getAuthor(),
                b.getRating(),
                b.getSwatch(),
                b.getCategory(),
                reason,
                score,
                tagList
        );
    }

    private UserPreferenceDto toPreferenceDto(UserPreference pref) {
        List<String> cats = (pref.getPreferredCategories() != null && !pref.getPreferredCategories().isBlank())
                ? Arrays.stream(pref.getPreferredCategories().split(",")).map(String::trim).toList()
                : List.of();
        List<String> authors = (pref.getPreferredAuthors() != null && !pref.getPreferredAuthors().isBlank())
                ? Arrays.stream(pref.getPreferredAuthors().split(",")).map(String::trim).toList()
                : List.of();

        return new UserPreferenceDto(pref.getUserId(), cats, authors, pref.getMinRating());
    }

    private static class ScoredBook {
        final BookAffinity book;
        final double score;
        final String reason;

        ScoredBook(BookAffinity book, double score, String reason) {
            this.book = book;
            this.score = score;
            this.reason = reason;
        }
    }
}
