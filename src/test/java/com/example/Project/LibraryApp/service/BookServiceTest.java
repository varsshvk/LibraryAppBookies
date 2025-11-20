package com.example.Project.LibraryApp.service;


import com.example.Project.LibraryApp.entity.Book;
import com.example.Project.LibraryApp.entity.Category;
import com.example.Project.LibraryApp.exception.ResourceNotFoundException;
import com.example.Project.LibraryApp.repository.BookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookServiceImpl bookService;

    private Book book;

    @BeforeEach
    void setup() {
        Category category = new Category();
        category.setCid(1L);
        category.setName("Fiction");

        book = new Book();
        book.setBid(1L);
        book.setTitle("The Alchemist");
        book.setAuthor("Paulo Coelho");
        book.setPublishedDate(LocalDate.of(2005, 1, 1));
        book.setCategory(category);
    }

    @Test
    void testSaveBook_Success() {
        when(bookRepository.save(any(Book.class))).thenReturn(book);

        Book savedBook = bookService.saveBook(book);

        assertNotNull(savedBook);
        assertEquals("The Alchemist", savedBook.getTitle());
        verify(bookRepository, times(1)).save(book);
    }

    @Test
    void testSaveBook_FutureDate_ThrowsException() {
        book.setPublishedDate(LocalDate.now().plusDays(5));

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            bookService.saveBook(book);
        });

        assertEquals("Published date cannot be in the future.", exception.getMessage());
        verify(bookRepository, never()).save(any());
    }

    @Test
    void testUpdateBook_Success() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(bookRepository.save(any(Book.class))).thenReturn(book);

        Book updateDetails = new Book();
        updateDetails.setTitle("Updated Title");
        updateDetails.setPublishedDate(LocalDate.of(2010, 1, 1));

        Book updatedBook = bookService.updateBook(1L, updateDetails);

        assertNotNull(updatedBook);
        assertEquals("Updated Title", updatedBook.getTitle());
        verify(bookRepository, times(1)).save(any(Book.class));
    }

    @Test
    void testUpdateBook_NotFound_ThrowsException() {
        when(bookRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            bookService.updateBook(99L, book);
        });

        verify(bookRepository, never()).save(any());
    }
}
