package com.example.Project.LibraryApp.dto;

import java.time.LocalDate;

public class BorrowedBookDTO {
    private Long id;
    private Long userId;
    private Long bookId;
    private LocalDate borrowDate;
 
    private LocalDate returnDate;
    private Double fineAmount;
    private BookDTO book;
    public BookDTO getBook() {
		return book;
	}
	public void setBook(BookDTO book) {
		this.book = book;
	}
	
    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }

    public LocalDate getBorrowDate() { return borrowDate; }
    public void setBorrowDate(LocalDate borrowDate) { this.borrowDate = borrowDate; }

    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }

    public Double getFineAmount() { return fineAmount; }
    public void setFineAmount(Double fineAmount) { this.fineAmount = fineAmount; }
}
