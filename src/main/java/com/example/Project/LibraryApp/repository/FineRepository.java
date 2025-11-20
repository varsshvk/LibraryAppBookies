package com.example.Project.LibraryApp.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Project.LibraryApp.entity.Book;
import com.example.Project.LibraryApp.entity.Fine;
import com.example.Project.LibraryApp.entity.Users;



public interface FineRepository extends JpaRepository<Fine, Long> {
    Fine findByUserAndBook(Users user, Book book);
}

