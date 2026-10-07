package com.archivalia.ai.repository;

import com.archivalia.ai.entity.StudyPack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudyPackRepository extends JpaRepository<StudyPack, Long> {

    Optional<StudyPack> findTopByIsbnIgnoreCaseOrderByCreatedAtDesc(String isbn);

    Optional<StudyPack> findTopByBookTitleIgnoreCaseOrderByCreatedAtDesc(String bookTitle);

    List<StudyPack> findTop10ByOrderByCreatedAtDesc();
}
