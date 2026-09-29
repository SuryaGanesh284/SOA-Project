package com.archivalia.borrow.service;

import com.archivalia.borrow.client.BookServiceClient;
import com.archivalia.borrow.dto.BorrowRequest;
import com.archivalia.borrow.dto.BorrowResponse;
import com.archivalia.borrow.entity.BorrowStatus;
import com.archivalia.borrow.entity.BorrowTransaction;
import com.archivalia.borrow.exception.ConflictException;
import com.archivalia.borrow.exception.ResourceNotFoundException;
import com.archivalia.borrow.repository.BorrowRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class BorrowService {

    private final BorrowRepository borrowRepository;
    private final BookServiceClient bookServiceClient;

    public BorrowService(BorrowRepository borrowRepository, BookServiceClient bookServiceClient) {
        this.borrowRepository = borrowRepository;
        this.bookServiceClient = bookServiceClient;
    }

    @Transactional
    public BorrowResponse borrowBook(BorrowRequest request, String username) {
        // Prevent multiple active borrows of the same book by the same user
        if (borrowRepository.existsByUsernameAndBookIdAndStatus(username, request.getBookId(), BorrowStatus.ACTIVE)) {
            throw new ConflictException("User has already borrowed this book and has not returned it.");
        }

        // Call Book Service to reserve a copy
        bookServiceClient.reserveBook(request.getBookId());

        // Create transaction
        BorrowTransaction transaction = new BorrowTransaction();
        transaction.setUsername(username);
        transaction.setBookId(request.getBookId());
        transaction.setBorrowedAt(LocalDateTime.now());
        transaction.setDueAt(LocalDateTime.now().plusDays(14)); // Standard 14 day borrow period
        transaction.setStatus(BorrowStatus.ACTIVE);

        BorrowTransaction saved = borrowRepository.save(transaction);
        return mapToResponse(saved);
    }

    @Transactional
    public BorrowResponse returnBook(Long id, String username) {
        BorrowTransaction transaction = borrowRepository.findByIdAndUsername(id, username)
                .orElseThrow(() -> new ResourceNotFoundException("Borrow transaction not found for this user"));

        if (transaction.getStatus() == BorrowStatus.RETURNED) {
            throw new ConflictException("Book has already been returned.");
        }

        // Return copy to Book Service
        bookServiceClient.releaseBook(transaction.getBookId());

        transaction.setStatus(BorrowStatus.RETURNED);
        transaction.setReturnedAt(LocalDateTime.now());
        BorrowTransaction saved = borrowRepository.save(transaction);

        return mapToResponse(saved);
    }

    public Page<BorrowResponse> getBorrowHistory(String username, Pageable pageable) {
        return borrowRepository.findByUsername(username, pageable)
                .map(this::mapToResponse);
    }

    public BorrowResponse getBorrowById(Long id, String username, boolean isAdmin) {
        BorrowTransaction transaction = borrowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Borrow transaction not found"));

        if (!isAdmin && !transaction.getUsername().equals(username)) {
            throw new ResourceNotFoundException("Borrow transaction not found");
        }

        return mapToResponse(transaction);
    }

    private BorrowResponse mapToResponse(BorrowTransaction transaction) {
        BorrowResponse response = new BorrowResponse();
        response.setId(transaction.getId());
        response.setUsername(transaction.getUsername());
        response.setBookId(transaction.getBookId());
        response.setBorrowedAt(transaction.getBorrowedAt());
        response.setDueAt(transaction.getDueAt());
        response.setReturnedAt(transaction.getReturnedAt());
        response.setStatus(transaction.getStatus());
        response.setCreatedAt(transaction.getCreatedAt());
        response.setUpdatedAt(transaction.getUpdatedAt());
        return response;
    }
}
