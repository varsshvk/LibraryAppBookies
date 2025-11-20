package com.example.Project.LibraryApp.service;

import com.example.Project.LibraryApp.entity.Fine;
import com.example.Project.LibraryApp.entity.Users;
import com.example.Project.LibraryApp.entity.Book;

public interface FineService {
    Fine getFineForUserAndBook(Users user, Book book);
    Fine saveFine(Fine fine);
}
