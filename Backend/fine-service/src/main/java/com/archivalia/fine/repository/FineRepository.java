package com.archivalia.fine.repository;

import com.archivalia.fine.entity.Fine;
import com.archivalia.fine.entity.FineStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {
    List<Fine> findAllByOrderByIssuedAtDesc();
    List<Fine> findByUserIdOrderByIssuedAtDesc(String userId);
    List<Fine> findByStatus(FineStatus status);
    Optional<Fine> findByFineCode(String fineCode);
    List<Fine> findByLoanId(Long loanId);
}
