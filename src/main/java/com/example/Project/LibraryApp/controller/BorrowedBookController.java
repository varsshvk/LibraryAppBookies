package com.example.Project.LibraryApp.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.Project.LibraryApp.Mapper.BorrowedBookMapper;
import com.example.Project.LibraryApp.dto.BorrowedBookDTO;
import com.example.Project.LibraryApp.entity.Book;
import com.example.Project.LibraryApp.entity.BorrowedBook;
import com.example.Project.LibraryApp.entity.Users;
import com.example.Project.LibraryApp.repository.UserRepository;
import com.example.Project.LibraryApp.service.BorrowedBookService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/borrowed-books")
public class BorrowedBookController {

    @Autowired
    private BorrowedBookService borrowedBookService;

    @Autowired
    private UserRepository userRepository;
    
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/all")
    public List<BorrowedBookDTO> getAllBorrowedBooks() {
        List<BorrowedBook> borrowedBooks = borrowedBookService.getAllBorrowedBooks();
        return borrowedBooks.stream()
            .map(BorrowedBookMapper::toDTO)
            .collect(Collectors.toList());
    }
    

    @GetMapping("/my")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public List<BorrowedBookDTO> getMyBorrowedBooks(Authentication authentication) {
        String username = authentication.getName();

        Optional<Users> userOpt = userRepository.findByUsername(username);

        Users user = userOpt.orElseThrow(() -> new RuntimeException("User not found"));

        List<BorrowedBook> borrowedBooks = borrowedBookService.getBorrowedBooksByUser(user);

        return borrowedBooks.stream()
                            .map(BorrowedBookMapper::toDTO)
                            .collect(Collectors.toList());
    }

    
    @PostMapping("/borrow")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public BorrowedBookDTO borrowBook(@RequestBody BorrowedBookDTO borrowedBookDTO, Authentication authentication) {
        String username = authentication.getName();
        Users user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        BorrowedBook borrowedBook = borrowedBookService.borrowBook(
            user,
            new Book(borrowedBookDTO.getBookId())
        );
        return BorrowedBookMapper.toDTO(borrowedBook);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @PostMapping("/return")
    public ResponseEntity<Map<String, String>> returnBook(@RequestBody BorrowedBookDTO borrowedBookDTO, Authentication authentication) {
        String username = authentication.getName(); // Get logged-in username
        Map<String, String> response = new HashMap<>();

        try {
            String message = borrowedBookService.returnBook(
                borrowedBookDTO.getId(),
                borrowedBookDTO.getFineAmount(),
                username
            );

            response.put("status", "success");
            response.put("message", message);
            return ResponseEntity.ok(response);

        } catch (AccessDeniedException ex) {
            response.put("status", "forbidden");
            response.put("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);

        } catch (RuntimeException ex) {
            response.put("status", "error");
            response.put("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }


    

    
}
