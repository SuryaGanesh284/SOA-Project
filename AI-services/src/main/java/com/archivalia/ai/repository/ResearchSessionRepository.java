package com.archivalia.ai.repository;

import com.archivalia.ai.entity.ResearchSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResearchSessionRepository extends JpaRepository<ResearchSession, Long> {

    List<ResearchSession> findByUserIdOrderByCreatedAtDesc(String userId);

    List<ResearchSession> findAllByOrderByCreatedAtDesc();
}
