package com.archivalia.borrow.repository;

import com.archivalia.borrow.entity.Loan;
import com.archivalia.borrow.entity.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findAllByOrderByBorrowedAtDesc();
    List<Loan> findByUserIdOrderByBorrowedAtDesc(String userId);
    Optional<Loan> findByCopyCodeAndReturnedAtIsNull(String copyCode);
    Optional<Loan> findByLoanCode(String loanCode);
    List<Loan> findByStatus(LoanStatus status);
}
