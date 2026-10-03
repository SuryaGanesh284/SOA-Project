package com.archivalia.book.repository;

import com.archivalia.book.entity.BookCopy;
import com.archivalia.book.entity.CopyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookCopyRepository extends JpaRepository<BookCopy, Long> {
    Optional<BookCopy> findByCopyCodeIgnoreCase(String copyCode);
    List<BookCopy> findByBookId(Long bookId);
    List<BookCopy> findByStatus(CopyStatus status);
}
