package com.example.Project.LibraryApp.service;

import com.example.Project.LibraryApp.entity.Fine;
import com.example.Project.LibraryApp.entity.Users;
import com.example.Project.LibraryApp.entity.Book;
import com.example.Project.LibraryApp.repository.FineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FineServiceImpl implements FineService {

    @Autowired
    private FineRepository fineRepository;

    @Override
    public Fine getFineForUserAndBook(Users user, Book book) {
        return fineRepository.findByUserAndBook(user, book);
    }

    @Override
    public Fine saveFine(Fine fine) {
        return fineRepository.save(fine);
    }
}
