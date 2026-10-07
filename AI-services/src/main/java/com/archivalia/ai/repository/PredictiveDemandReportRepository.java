package com.archivalia.ai.repository;

import com.archivalia.ai.entity.PredictiveDemandReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PredictiveDemandReportRepository extends JpaRepository<PredictiveDemandReport, Long> {

    Optional<PredictiveDemandReport> findTopByOrderByGeneratedAtDesc();
}
