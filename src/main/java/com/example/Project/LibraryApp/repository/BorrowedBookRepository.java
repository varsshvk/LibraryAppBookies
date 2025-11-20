package com.example.Project.LibraryApp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Project.LibraryApp.entity.Book;
import com.example.Project.LibraryApp.entity.BorrowedBook;
import com.example.Project.LibraryApp.entity.Users;

import java.time.LocalDate;
import java.util.List;


public interface BorrowedBookRepository extends JpaRepository<BorrowedBook, Long> {
    List<BorrowedBook> findByUser(Users user);
    List<BorrowedBook> findByBook(Book book);
    List<BorrowedBook> findByReturnDateIsNull(); // For books that are not yet returned
    
}
