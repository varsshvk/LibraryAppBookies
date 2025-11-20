package com.example.Project.LibraryApp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.Project.LibraryApp.entity.Book;
import com.example.Project.LibraryApp.entity.BorrowedBook;
import com.example.Project.LibraryApp.entity.Category;
import com.example.Project.LibraryApp.entity.Users;

import java.time.LocalDate;
import java.util.List;


public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByAvailability(Book.Availability availability);
    List<Book> findByCategory(Category category);
    List<Book> findByTitleContainingOrAuthorContaining(String title, String author);
    @Query("SELECT b FROM Book b WHERE " +
    	       "(:title = '' OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
    	       "(:author = '' OR LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%'))) AND " +
    	       "(:language = '' OR LOWER(b.language) LIKE LOWER(CONCAT('%', :language, '%'))) AND " +
    	       "(:category = '' OR LOWER(b.category.name) LIKE LOWER(CONCAT('%', :category, '%')))")
	List<Book> findByFilters(String title, String author, String language, String category);
    @Modifying
    @Transactional
    @Query("UPDATE Book b SET b.availability = :availability WHERE b.bid = :bookId")
    int updateBookAvailability(@Param("availability") Book.Availability availability,
                               @Param("bookId") Long bookId);
    
    //  Find all books borrowed by a user on a specific date
    @Query("SELECT b FROM BorrowedBook b WHERE b.user = :user AND b.borrowDate = :date")
    List<BorrowedBook> findByUserAndBorrowDate(@Param("user") Users user, @Param("date") LocalDate date);
}
