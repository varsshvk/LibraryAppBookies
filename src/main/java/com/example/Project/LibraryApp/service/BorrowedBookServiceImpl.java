package com.example.Project.LibraryApp.service;

import com.example.Project.LibraryApp.entity.BorrowedBook;
import com.example.Project.LibraryApp.entity.Users;
import com.example.Project.LibraryApp.exception.ResourceNotFoundException;
import com.example.Project.LibraryApp.entity.Book;
import com.example.Project.LibraryApp.repository.BookRepository;
import com.example.Project.LibraryApp.repository.BorrowedBookRepository;
import com.example.Project.LibraryApp.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BorrowedBookServiceImpl implements BorrowedBookService {

    @Autowired
    private BorrowedBookRepository borrowedBookRepository;

    @Autowired
    private UserRepository userRepository;
  
    @Autowired
    private BookRepository bookRepository;

    // borrrow book
    @Transactional
    @Override
    public BorrowedBook borrowBook(Users user, Book book) {
    	
    	Book freshBook = bookRepository.findById(book.getBid())
    		    .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

    		if (freshBook.getAvailability() != Book.Availability.AVAILABLE) {
    		    throw new IllegalStateException("Book is not available for borrowing");
    		}

        BorrowedBook borrowedBook = new BorrowedBook();
        borrowedBook.setUser(user);
        borrowedBook.setBook(freshBook);

        LocalDate borrowDate = LocalDate.now();
        borrowedBook.setBorrowDate(borrowDate);
        borrowedBook.setReturnDate(borrowDate.plusDays(10));
        borrowedBook.setFineAmount(0.0);
        
        borrowedBookRepository.save(borrowedBook);

       
        bookRepository.updateBookAvailability(Book.Availability.BORROWED, freshBook.getBid());

        return borrowedBook;
    }
    
    @Transactional
    public String returnBook(Long borrowedBookId, Double fine, String username) {
        if (borrowedBookId == null || borrowedBookId == 0) {
            throw new IllegalArgumentException("Invalid borrowed book ID");
        }

        //  Fetch BorrowedBook
        BorrowedBook persistentBorrowedBook = borrowedBookRepository.findById(borrowedBookId)
                .orElseThrow(() -> new ResourceNotFoundException("BorrowedBook not found"));

        // Fetch current user
        Users currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check ownership (or admin override)
        boolean isAdmin = currentUser.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_ADMIN"));

        if (!isAdmin && !persistentBorrowedBook.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You cannot return a book borrowed by another user!");
        }

        //  Continue with your existing logic
        LocalDate expectedReturnDate = persistentBorrowedBook.getReturnDate(); // stored at borrow time
        LocalDate actualReturnDate = LocalDate.now();
        persistentBorrowedBook.setReturnDate(actualReturnDate);

        long daysLate = 0;
        if (actualReturnDate.isAfter(expectedReturnDate)) {
            daysLate = expectedReturnDate.until(actualReturnDate).getDays();
        }

        double calculatedFine = daysLate > 0 ? daysLate * 5 : 0.0;
        persistentBorrowedBook.setFineAmount(calculatedFine);

        borrowedBookRepository.save(persistentBorrowedBook);

        //  Update book availability
        Book book = persistentBorrowedBook.getBook();
        bookRepository.updateBookAvailability(Book.Availability.AVAILABLE, book.getBid());

        return "Book returned successfully!";
    }


	@Override
	public List<BorrowedBook> getAllBorrowedBooks() {
		// TODO Auto-generated method stub
		return borrowedBookRepository.findAll();
	}

	public List<BorrowedBook> getBorrowedBooksByUser(Users user) {
	    return borrowedBookRepository.findByUser(user);
	}
	@Override
	public String returnBook(BorrowedBook borrowedBook, Double fine) {
		// TODO Auto-generated method stub
		return null;
	}
	

   
}
