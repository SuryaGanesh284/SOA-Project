package com.archivalia.borrow.service;

import com.archivalia.borrow.client.BookServiceClient;
import com.archivalia.borrow.dto.BookCopyDto;
import com.archivalia.borrow.dto.BookDto;
import com.archivalia.borrow.dto.BorrowRequest;
import com.archivalia.borrow.dto.LoanDto;
import com.archivalia.borrow.entity.Loan;
import com.archivalia.borrow.entity.LoanStatus;
import com.archivalia.borrow.repository.LoanRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Transactional
public class BorrowService {

    private static final Logger log = LoggerFactory.getLogger(BorrowService.class);

    private final LoanRepository loanRepository;
    private final BookServiceClient bookServiceClient;

    public BorrowService(LoanRepository loanRepository, BookServiceClient bookServiceClient) {
        this.loanRepository = loanRepository;
        this.bookServiceClient = bookServiceClient;
    }

    @Transactional(readOnly = true)
    public List<LoanDto> getAllLoans() {
        return loanRepository.findAllByOrderByBorrowedAtDesc().stream()
                .map(this::checkOverdueAndConvert)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LoanDto> getUserLoans(String userId) {
        String targetId = (userId != null && !userId.trim().isEmpty()) ? userId.trim() : "USR-101";
        return loanRepository.findByUserIdOrderByBorrowedAtDesc(targetId).stream()
                .map(this::checkOverdueAndConvert)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LoanDto getLoanById(Long id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Loan record not found with id: " + id));
        return toDto(loan);
    }

    public LoanDto borrowBook(BorrowRequest request) {
        String title = request.getTitle() != null ? request.getTitle().trim() : "";
        if (title.isEmpty()) {
            throw new IllegalArgumentException("Book title is required.");
        }

        String userId = (request.getUserId() != null && !request.getUserId().trim().isEmpty())
                ? request.getUserId().trim() : "USR-101";
        String userName = (request.getUserName() != null && !request.getUserName().trim().isEmpty())
                ? request.getUserName().trim() : "Ben Bradle";
        String userEmail = (request.getUserEmail() != null && !request.getUserEmail().trim().isEmpty())
                ? request.getUserEmail().trim() : "user@archivalia.test";

        String targetCopyCode = request.getCopyCode() != null ? request.getCopyCode().trim() : null;

        if (targetCopyCode == null || targetCopyCode.isEmpty()) {
            try {
                BookDto book = bookServiceClient.getBookByTitle(title);
                if (book != null && book.getCopies() != null) {
                    for (BookCopyDto copy : book.getCopies()) {
                        if ("AVAILABLE".equalsIgnoreCase(copy.getStatus())) {
                            targetCopyCode = copy.getCode();
                            break;
                        }
                    }
                }
            } catch (Exception e) {
                log.warn("Unable to fetch book copies from Book Service: {}", e.getMessage());
            }

            if (targetCopyCode == null || targetCopyCode.isEmpty()) {
                targetCopyCode = "CPY-" + (100 + (int)(Math.random() * 900));
            }
        }

        // Notify Book Service to set copy status to BORROWED
        try {
            bookServiceClient.borrowCopy(targetCopyCode);
        } catch (Exception e) {
            log.warn("Could not notify Book Service for copy {}: {}", targetCopyCode, e.getMessage());
        }

        int days = (request.getDays() != null && request.getDays() > 0) ? request.getDays() : 14;
        LocalDate now = LocalDate.now();
        LocalDate due = now.plusDays(days);
        String loanCode = "loan-" + System.currentTimeMillis();

        Loan loan = new Loan(loanCode, userId, userName, userEmail, targetCopyCode, title, now, due);
        Loan saved = loanRepository.save(loan);
        log.info("Created new loan {} for user {} on title '{}' copy {}", loanCode, userId, title, targetCopyCode);
        return toDto(saved);
    }

    public LoanDto returnBook(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new NoSuchElementException("Loan record not found with id: " + loanId));

        if (loan.getReturnedAt() != null) {
            return toDto(loan);
        }

        loan.setReturnedAt(LocalDate.now());
        loan.setStatus(LoanStatus.RETURNED);
        Loan saved = loanRepository.save(loan);

        // Notify Book Service to release copy back to AVAILABLE
        try {
            bookServiceClient.releaseCopy(loan.getCopyCode());
        } catch (Exception e) {
            log.warn("Could not release copy in Book Service: {}", e.getMessage());
        }

        log.info("Recorded return for loan id {} on title '{}' copy {}", loanId, loan.getBookTitle(), loan.getCopyCode());
        return toDto(saved);
    }

    private LoanDto checkOverdueAndConvert(Loan loan) {
        if (loan.getReturnedAt() == null && loan.getDueAt().isBefore(LocalDate.now()) && loan.getStatus() == LoanStatus.ACTIVE) {
            loan.setStatus(LoanStatus.OVERDUE);
            loanRepository.save(loan);
        }
        return toDto(loan);
    }

    public LoanDto toDto(Loan loan) {
        return new LoanDto(
                loan.getId(),
                loan.getLoanCode(),
                loan.getUserId(),
                loan.getUserName(),
                loan.getUserEmail(),
                loan.getCopyCode(),
                loan.getBookTitle(),
                loan.getBorrowedAt().toString(),
                loan.getDueAt().toString(),
                loan.getReturnedAt() != null ? loan.getReturnedAt().toString() : null,
                loan.getStatus().name()
        );
    }
}
