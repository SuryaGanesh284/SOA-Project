package com.archivalia.book.service;

import com.archivalia.book.dto.BookCopyDto;
import com.archivalia.book.dto.BookDto;
import com.archivalia.book.dto.BookUpsertRequest;
import com.archivalia.book.entity.Book;
import com.archivalia.book.entity.BookCopy;
import com.archivalia.book.entity.CopyStatus;
import com.archivalia.book.repository.BookCopyRepository;
import com.archivalia.book.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookService {

    private static final List<String> FORMAT_GROUPS = Arrays.asList("ebooks", "papers", "videos", "audio", "physical");

    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;

    public BookService(BookRepository bookRepository, BookCopyRepository bookCopyRepository) {
        this.bookRepository = bookRepository;
        this.bookCopyRepository = bookCopyRepository;
    }

    @Transactional(readOnly = true)
    public List<BookDto> getAllBooks(String query, String format) {
        List<Book> books;
        if (query != null && !query.trim().isEmpty()) {
            books = bookRepository.searchBooks(query.trim());
        } else if (format != null && !format.trim().isEmpty()) {
            books = bookRepository.findByGroup(format.trim());
        } else {
            books = bookRepository.findByActiveTrue();
        }

        if (format != null && !format.trim().isEmpty() && query != null && !query.trim().isEmpty()) {
            String lowerFormat = format.trim().toLowerCase();
            books = books.stream()
                    .filter(b -> b.getGroups() != null && b.getGroups().toLowerCase().contains(lowerFormat))
                    .collect(Collectors.toList());
        }

        return books.stream().map(this::toBookDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookDto getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Book not found with id: " + id));
        return toBookDto(book);
    }

    @Transactional(readOnly = true)
    public BookDto getBookByTitle(String title) {
        Book book = bookRepository.findByTitleIgnoreCase(title.trim())
                .orElseThrow(() -> new NoSuchElementException("Book not found with title: " + title));
        return toBookDto(book);
    }

    public BookDto createOrUpdateBook(BookUpsertRequest request) {
        if (request.getOriginalTitle() != null && !request.getOriginalTitle().trim().isEmpty()) {
            String originalTitle = request.getOriginalTitle().trim();
            Book book = bookRepository.findByTitleIgnoreCase(originalTitle)
                    .orElseThrow(() -> new NoSuchElementException("Resource not found to edit: " + originalTitle));

            if (!originalTitle.equalsIgnoreCase(request.getTitle().trim())) {
                Optional<Book> duplicate = bookRepository.findByTitleIgnoreCase(request.getTitle().trim());
                if (duplicate.isPresent()) {
                    throw new IllegalArgumentException("A resource with that title already exists.");
                }
            }

            book.setTitle(request.getTitle().trim());
            book.setAuthor(request.getAuthor().trim());
            book.setPublicationYear(request.getYear());
            book.setDescription(request.getDescription() != null ? request.getDescription().trim() : "");

            // Update format group while keeping secondary groups (e.g. saved, quiet, etc.)
            List<String> currentGroups = new ArrayList<>(book.getGroupsList());
            currentGroups.removeIf(FORMAT_GROUPS::contains);
            String newFormat = request.getFormat() != null ? request.getFormat().trim() : "ebooks";
            currentGroups.add(0, newFormat);
            book.setGroups(String.join(",", currentGroups));

            Book saved = bookRepository.save(book);
            return toBookDto(saved);
        } else {
            // New Book creation
            String title = request.getTitle().trim();
            Optional<Book> duplicate = bookRepository.findByTitleIgnoreCase(title);
            if (duplicate.isPresent()) {
                throw new IllegalArgumentException("A resource with that title already exists.");
            }

            String format = request.getFormat() != null ? request.getFormat().trim() : "ebooks";
            Book book = new Book(
                    title,
                    request.getAuthor().trim(),
                    request.getYear(),
                    4,
                    "from-sky-400 to-blue-800",
                    format,
                    request.getDescription() != null ? request.getDescription().trim() : ""
            );

            // Generate initial copy
            String prefix = "physical".equalsIgnoreCase(format) ? "PHY" : "DIG";
            String copyCode = prefix + "-" + (100 + new Random().nextInt(900));
            String location = "physical".equalsIgnoreCase(format)
                    ? (request.getLocation() != null ? request.getLocation() : "Shelf A1")
                    : "Online";
            book.addCopy(copyCode, CopyStatus.AVAILABLE, location);

            Book saved = bookRepository.save(book);
            return toBookDto(saved);
        }
    }

    public BookDto updateBook(Long id, BookUpsertRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Book not found with id: " + id));

        if (!book.getTitle().equalsIgnoreCase(request.getTitle().trim())) {
            Optional<Book> duplicate = bookRepository.findByTitleIgnoreCase(request.getTitle().trim());
            if (duplicate.isPresent() && !duplicate.get().getId().equals(id)) {
                throw new IllegalArgumentException("A resource with that title already exists.");
            }
        }

        book.setTitle(request.getTitle().trim());
        book.setAuthor(request.getAuthor().trim());
        book.setPublicationYear(request.getYear());
        book.setDescription(request.getDescription() != null ? request.getDescription().trim() : "");

        if (request.getFormat() != null && !request.getFormat().trim().isEmpty()) {
            List<String> currentGroups = new ArrayList<>(book.getGroupsList());
            currentGroups.removeIf(FORMAT_GROUPS::contains);
            currentGroups.add(0, request.getFormat().trim());
            book.setGroups(String.join(",", currentGroups));
        }

        Book saved = bookRepository.save(book);
        return toBookDto(saved);
    }

    @Transactional(readOnly = true)
    public List<BookCopyDto> getAllCopies() {
        return bookCopyRepository.findAll().stream()
                .map(this::toCopyDto)
                .collect(Collectors.toList());
    }

    public BookCopyDto updateCopyStatus(String copyCode, CopyStatus status) {
        BookCopy copy = bookCopyRepository.findByCopyCodeIgnoreCase(copyCode.trim())
                .orElseThrow(() -> new NoSuchElementException("Copy not found with code: " + copyCode));
        copy.setStatus(status);
        BookCopy saved = bookCopyRepository.save(copy);
        return toCopyDto(saved);
    }

    public BookCopyDto borrowCopy(String copyCode) {
        BookCopy copy = bookCopyRepository.findByCopyCodeIgnoreCase(copyCode.trim())
                .orElseThrow(() -> new NoSuchElementException("Copy not found with code: " + copyCode));
        if (copy.getStatus() != CopyStatus.AVAILABLE) {
            throw new IllegalStateException("Copy " + copyCode + " is not available. Status: " + copy.getStatus());
        }
        copy.setStatus(CopyStatus.BORROWED);
        BookCopy saved = bookCopyRepository.save(copy);
        return toCopyDto(saved);
    }

    public BookCopyDto releaseCopy(String copyCode) {
        BookCopy copy = bookCopyRepository.findByCopyCodeIgnoreCase(copyCode.trim())
                .orElseThrow(() -> new NoSuchElementException("Copy not found with code: " + copyCode));
        copy.setStatus(CopyStatus.AVAILABLE);
        BookCopy saved = bookCopyRepository.save(copy);
        return toCopyDto(saved);
    }

    @Transactional(readOnly = true)
    public BookCopyDto getCopyByCode(String copyCode) {
        BookCopy copy = bookCopyRepository.findByCopyCodeIgnoreCase(copyCode.trim())
                .orElseThrow(() -> new NoSuchElementException("Copy not found with code: " + copyCode));
        return toCopyDto(copy);
    }

    private BookDto toBookDto(Book book) {
        List<BookCopyDto> copyDtos = book.getCopies().stream()
                .map(c -> new BookCopyDto(c.getCopyCode(), c.getStatus().name(), c.getLocation(), book.getTitle()))
                .collect(Collectors.toList());

        return new BookDto(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getPublicationYear(),
                book.getRating(),
                book.getSwatch(),
                book.getGroupsList(),
                book.getDescription(),
                copyDtos
        );
    }

    private BookCopyDto toCopyDto(BookCopy copy) {
        String title = copy.getBook() != null ? copy.getBook().getTitle() : null;
        return new BookCopyDto(
                copy.getCopyCode(),
                copy.getStatus().name(),
                copy.getLocation(),
                title
        );
    }
}
