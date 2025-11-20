package com.example.Project.LibraryApp.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.Project.LibraryApp.entity.Category;
import com.example.Project.LibraryApp.service.CategoryService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/search") // search categories by name (optional)
    public List<Category> searchCategories(@RequestParam(name = "name", required = false) String name) {
        if (name == null || name.isBlank()) {
            return categoryService.getAllCategories();
        }
        return categoryService.findByNameContainingIgnoreCase(name);
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public Category addCategory(@RequestBody Category category) {
        return categoryService.saveCategory(category);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{cid}")
    public void deleteCategory(@PathVariable Long cid) {
        categoryService.deleteCategory(cid);
    }
}
