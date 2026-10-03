package com.archivalia.borrow.repository;

import com.archivalia.borrow.entity.BorrowTransaction;
import com.archivalia.borrow.entity.BorrowStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BorrowRepository extends JpaRepository<BorrowTransaction, Long> {
    Page<BorrowTransaction> findByUsername(String username, Pageable pageable);
    
    Optional<BorrowTransaction> findByIdAndUsername(Long id, String username);

    boolean existsByUsernameAndBookIdAndStatus(String username, Long bookId, BorrowStatus status);
}
