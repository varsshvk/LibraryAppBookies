package com.example.Project.LibraryApp.service;

import com.example.Project.LibraryApp.entity.Category;
import com.example.Project.LibraryApp.repository.CategoryRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    
    @Override
    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

	@Override
	public List<Category> getAllCategories() {
		// TODO Auto-generated method stub
		return categoryRepository.findAll();
	}

	@Override
	public List<Category> findByNameContainingIgnoreCase(String name) {
		// TODO Auto-generated method stub
		return categoryRepository.findByNameContainingIgnoreCase(name);
	}
}
