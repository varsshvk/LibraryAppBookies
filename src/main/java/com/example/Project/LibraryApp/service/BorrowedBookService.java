package com.example.Project.LibraryApp.service;

import com.example.Project.LibraryApp.entity.BorrowedBook;
import com.example.Project.LibraryApp.entity.Users;
import com.example.Project.LibraryApp.entity.Book;

import java.time.LocalDate;
import java.util.List;

public interface BorrowedBookService {
	List<BorrowedBook> getAllBorrowedBooks();
    BorrowedBook borrowBook(Users user, Book book);
    String returnBook(BorrowedBook borrowedBook, Double fine);
	List<BorrowedBook> getBorrowedBooksByUser(Users user);
	String returnBook(Long id, Double fineAmount, String username);


}
