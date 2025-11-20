package com.example.Project.LibraryApp.service;

import java.util.List;

import com.example.Project.LibraryApp.entity.Category;

public interface CategoryService {
    
    Category saveCategory(Category category);
    void deleteCategory(Long id);
	List<Category> getAllCategories();
	List<Category> findByNameContainingIgnoreCase(String name);
}
