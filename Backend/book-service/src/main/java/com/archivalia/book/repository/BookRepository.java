package com.archivalia.book.repository;

import com.archivalia.book.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByTitleIgnoreCase(String title);
    List<Book> findByActiveTrue();
    
    @Query("SELECT b FROM Book b WHERE b.active = true AND " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Book> searchBooks(@Param("query") String query);

    @Query("SELECT b FROM Book b WHERE b.active = true AND LOWER(b.groups) LIKE LOWER(CONCAT('%', :groupName, '%'))")
    List<Book> findByGroup(@Param("groupName") String groupName);
}
