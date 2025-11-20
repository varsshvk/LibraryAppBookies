package com.example.Project.LibraryApp.controller;


import com.example.Project.LibraryApp.entity.Category;
import com.example.Project.LibraryApp.jwt.JwtTokenProvider;
import com.example.Project.LibraryApp.service.CategoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = CategoryController.class)
@AutoConfigureMockMvc(addFilters = false)
class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CategoryService categoryService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private UserDetailsService userDetailsService;

    private Category category;

    @BeforeEach
    void setup() {
        category = new Category();
        category.setCid(1L);
        category.setName("Fiction");
    }

    // Test for fetching all categories
    @Test
    void testGetAllCategories_Success() throws Exception {
        when(categoryService.getAllCategories()).thenReturn(List.of(category));

        mockMvc.perform(get("/api/categories")
                        .with(user("varssha").authorities(() -> "ROLE_USER")) // simulate logged-in user
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Fiction"));
    }

    //  Test for adding a new category (admin only)
    @Test
    void testAddCategory_Success() throws Exception {
        when(categoryService.saveCategory(any(Category.class))).thenReturn(category);

        mockMvc.perform(post("/api/categories")
                        .with(user("admin").authorities(() -> "ROLE_ADMIN")) // simulate admin
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(category)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Fiction"));
    }

    //  Test for searching categories by name
    @Test
    void testSearchCategories_Success() throws Exception {
        when(categoryService.findByNameContainingIgnoreCase("Fiction")).thenReturn(List.of(category));

        mockMvc.perform(get("/api/categories/search")
                        .param("name", "Fiction")
                        .with(user("varssha").authorities(() -> "ROLE_USER"))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Fiction"));
    }
}

