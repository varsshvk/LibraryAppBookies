package com.example.Project.LibraryApp.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.Project.LibraryApp.entity.Book;
import com.example.Project.LibraryApp.entity.Category;
import com.example.Project.LibraryApp.service.BookService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

import java.util.List;
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/{bid}")
    public Book getBook(@PathVariable Long bid) {
        return bookService.getBookById(bid);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/search")
    public List<Book> searchBooks(
        @RequestParam(name = "title", required = false) String title,
        @RequestParam(name = "author", required = false) String author,
        @RequestParam(name = "language", required = false) String language,
        @RequestParam(name = "category", required = false) String category
    ) {
        return bookService.searchBooks(
            title != null ? title : "",
            author != null ? author : "",
            language != null ? language : "",
            category != null ? category : ""
        );
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")

    @PostMapping
    public ResponseEntity<Book> addBook(@Valid @RequestBody Book book) {
        Book savedBook = bookService.saveBook(book);
        return ResponseEntity.ok(savedBook);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{bid}")
    public Book updateBook(@PathVariable Long bid, @RequestBody Book bookDetails) {
        return bookService.updateBook(bid, bookDetails);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{bid}")
    public void deleteBook(@PathVariable Long bid) {
        bookService.deleteBook(bid);
    }
    
    
}
