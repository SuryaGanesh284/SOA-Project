package com.archivalia.recommendation.repository;

import com.archivalia.recommendation.entity.BookAffinity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookAffinityRepository extends JpaRepository<BookAffinity, Long> {
    Optional<BookAffinity> findByBookTitleIgnoreCase(String bookTitle);
    List<BookAffinity> findByCategoryIgnoreCase(String category);
    List<BookAffinity> findByRatingGreaterThanEqualOrderByRatingDesc(int rating);
    List<BookAffinity> findAllByOrderByPopularityScoreDesc();
}
