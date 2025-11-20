package com.example.Project.LibraryApp.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.Project.LibraryApp.entity.Book;
import com.example.Project.LibraryApp.entity.Fine;
import com.example.Project.LibraryApp.entity.Users;
import com.example.Project.LibraryApp.service.FineService;

@RestController
@RequestMapping("/api/fines")
public class FineController {

    @Autowired
    private FineService fineService;

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/user/{id}/book/{bid}")
    public Fine getFine(@PathVariable Long id, @PathVariable Long bid) {
        Users user = new Users(id);
        Book book = new Book(bid);
        return fineService.getFineForUserAndBook(user, book);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public Fine saveFine(@RequestBody Fine fine) {
        return fineService.saveFine(fine);
    }
}
