package com.archivalia.ai.repository;

import com.archivalia.ai.entity.BookSynopsis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookSynopsisRepository extends JpaRepository<BookSynopsis, Long> {

    Optional<BookSynopsis> findByIsbn(String isbn);

    Optional<BookSynopsis> findByBookTitleIgnoreCase(String bookTitle);
}
