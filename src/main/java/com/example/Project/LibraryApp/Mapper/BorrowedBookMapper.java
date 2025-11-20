package com.example.Project.LibraryApp.Mapper;

import com.example.Project.LibraryApp.dto.BorrowedBookDTO;
import com.example.Project.LibraryApp.entity.BorrowedBook;
import com.example.Project.LibraryApp.entity.Users;
import com.example.Project.LibraryApp.entity.Book;

public class BorrowedBookMapper {
    public static BorrowedBookDTO toDTO(BorrowedBook borrowedBook) {
        BorrowedBookDTO dto = new BorrowedBookDTO();
        dto.setId(borrowedBook.getId());
        dto.setUserId(borrowedBook.getUser().getId());
        dto.setBook(BookMapper.toDTO(borrowedBook.getBook()));
        dto.setBookId(borrowedBook.getBook().getBid());
        dto.setBorrowDate(borrowedBook.getBorrowDate());
        dto.setReturnDate(borrowedBook.getReturnDate());
        dto.setFineAmount(borrowedBook.getFineAmount());
        return dto;
    }

    public static BorrowedBook toEntity(BorrowedBookDTO dto) {
        BorrowedBook borrowedBook = new BorrowedBook();
        borrowedBook.setId(dto.getId());
        borrowedBook.setUser(new Users(dto.getUserId()));
        borrowedBook.setBook(new Book(dto.getBookId()));
        borrowedBook.setBorrowDate(dto.getBorrowDate());
        borrowedBook.setReturnDate(dto.getReturnDate());
        borrowedBook.setFineAmount(dto.getFineAmount());
        return borrowedBook;
    }
}
