package com.archivalia.fine.repository;

import com.archivalia.fine.entity.Fine;
import com.archivalia.fine.entity.FineStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {

    Optional<Fine> findByBorrowId(Long borrowId);

    Page<Fine> findByUserId(String userId, Pageable pageable);

    Page<Fine> findByStatus(FineStatus status, Pageable pageable);

    Page<Fine> findByUserIdAndStatus(String userId, FineStatus status, Pageable pageable);

    Page<Fine> findByUserIdAndStatusIn(String userId, List<FineStatus> statuses, Pageable pageable);

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM Fine f")
    BigDecimal sumTotalAmount();

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM Fine f WHERE f.status = :status")
    BigDecimal sumAmountByStatus(@Param("status") FineStatus status);

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM Fine f WHERE f.status IN :statuses")
    BigDecimal sumAmountByStatuses(@Param("statuses") List<FineStatus> statuses);
}
