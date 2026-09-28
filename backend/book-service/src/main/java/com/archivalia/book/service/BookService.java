package com.archivalia.book.service;

import com.archivalia.book.dto.BookRequest;
import com.archivalia.book.dto.BookResponse;
import com.archivalia.book.dto.PageResponse;
import com.archivalia.book.entity.Book;
import com.archivalia.book.exception.InventoryException;
import com.archivalia.book.exception.ResourceNotFoundException;
import com.archivalia.book.repository.BookRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<BookResponse> getAllBooks(int pageNo, int pageSize, String sortBy) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(sortBy));
        Page<Book> books = bookRepository.findAll(pageable);
        List<BookResponse> content = books.getContent().stream()
                .map(BookResponse::new)
                .collect(Collectors.toList());
        return new PageResponse<>(books, content);
    }

    @Transactional(readOnly = true)
    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        return new BookResponse(book);
    }

    @Transactional(readOnly = true)
    public PageResponse<BookResponse> searchBooks(String keyword, int pageNo, int pageSize, String sortBy) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(sortBy));
        Page<Book> books = bookRepository.searchBooks(keyword, pageable);
        List<BookResponse> content = books.getContent().stream()
                .map(BookResponse::new)
                .collect(Collectors.toList());
        return new PageResponse<>(books, content);
    }

    @Transactional
    public BookResponse createBook(BookRequest request) {
        if (bookRepository.existsByIsbn(request.getIsbn())) {
            throw new InventoryException("Book with ISBN already exists: " + request.getIsbn());
        }

        Book book = new Book();
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn());
        book.setCategory(request.getCategory());
        book.setDescription(request.getDescription());
        
        validateInventory(request.getTotalCopies(), request.getAvailableCopies());
        book.setTotalCopies(request.getTotalCopies());
        
        if (request.getAvailableCopies() != null) {
            book.setAvailableCopies(request.getAvailableCopies());
        } else {
            book.setAvailableCopies(request.getTotalCopies());
        }

        Book savedBook = bookRepository.save(book);
        return new BookResponse(savedBook);
    }

    @Transactional
    public BookResponse updateBook(Long id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

        if (!book.getIsbn().equals(request.getIsbn()) && bookRepository.existsByIsbn(request.getIsbn())) {
            throw new InventoryException("Book with ISBN already exists: " + request.getIsbn());
        }

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn());
        book.setCategory(request.getCategory());
        book.setDescription(request.getDescription());

        Integer newTotal = request.getTotalCopies();
        Integer newAvailable = request.getAvailableCopies() != null ? request.getAvailableCopies() : book.getAvailableCopies();
        
        validateInventory(newTotal, newAvailable);

        book.setTotalCopies(newTotal);
        book.setAvailableCopies(newAvailable);

        Book updatedBook = bookRepository.save(book);
        return new BookResponse(updatedBook);
    }

    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        bookRepository.delete(book);
    }

    private void validateInventory(Integer totalCopies, Integer availableCopies) {
        if (totalCopies == null || totalCopies < 0) {
            throw new InventoryException("Total copies cannot be negative");
        }
        if (availableCopies != null) {
            if (availableCopies < 0) {
                throw new InventoryException("Available copies cannot be negative");
            }
            if (availableCopies > totalCopies) {
                throw new InventoryException("Available copies cannot exceed total copies");
            }
        }
    }
}
