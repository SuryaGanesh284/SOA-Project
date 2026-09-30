package com.archivalia.fine.repository;

import com.archivalia.fine.entity.Fine;
import com.archivalia.fine.entity.FineStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {

    Optional<Fine> findByBorrowId(Long borrowId);

    Page<Fine> findByUserId(String userId, Pageable pageable);

    Page<Fine> findByStatus(FineStatus status, Pageable pageable);

    Page<Fine> findByUserIdAndStatus(String userId, FineStatus status, Pageable pageable);
}
