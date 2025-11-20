package com.example.Project.LibraryApp.service;


import com.example.Project.LibraryApp.entity.Book;
import com.example.Project.LibraryApp.entity.Category;

import java.util.List;

public interface BookService {
    List<Book> getAllBooks();
    Book getBookById(Long id);
    List<Book> getBooksByAvailability(Book.Availability availability);
    List<Book> getBooksByCategory(Category category);
    List<Book> searchBooks(String title, String author);
    Book saveBook(Book book);
    void deleteBook(Long id);
	Book updateBook(Long bid, Book bookDetails);
	//new method
	
	List<Book> searchBooks(String title, String author, String language, String category);
}
