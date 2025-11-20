package com.example.Project.LibraryApp.controller;


import com.example.Project.LibraryApp.entity.Book;
import com.example.Project.LibraryApp.jwt.JwtTokenProvider;
import com.example.Project.LibraryApp.service.BookService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = BookController.class)
@AutoConfigureMockMvc(addFilters = false)
class BookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BookService bookService;
    
    @MockBean
    private JwtTokenProvider jwtTokenProvider; 

    @MockBean
    private org.springframework.security.core.userdetails.UserDetailsService userDetailsService; 

    private Book book;

    @BeforeEach
    void setup() {
        book = new Book();
        book.setBid(1L);
        book.setTitle("The Alchemist");
        book.setAuthor("Paulo Coelho");
        book.setPublishedDate(LocalDate.of(2005, 1, 1));
    }

    @Test
    void testGetAllBooks_ReturnsBookList() throws Exception {
        when(bookService.getAllBooks()).thenReturn(List.of(book));

        mockMvc.perform(get("/api/books")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("The Alchemist"));
    }

    @Test
    void testGetBookById_ReturnsBook() throws Exception {
        when(bookService.getBookById(1L)).thenReturn(book);

        mockMvc.perform(get("/api/books/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.author").value("Paulo Coelho"));
    }
}

