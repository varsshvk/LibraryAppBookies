package com.example.Project.LibraryApp.service;

import com.example.Project.LibraryApp.entity.Book;
import com.example.Project.LibraryApp.entity.Category;
import com.example.Project.LibraryApp.exception.ResourceNotFoundException;
import com.example.Project.LibraryApp.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private BookRepository bookRepository;

    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public Book getBookById(Long id) {
        return bookRepository.findById(id).orElse(null);
    }

    @Override
    public List<Book> getBooksByAvailability(Book.Availability availability) {
        return bookRepository.findByAvailability(availability);
    }

    @Override
    public List<Book> getBooksByCategory(Category category) {
        return bookRepository.findByCategory(category);
    }

    @Override
    public List<Book> searchBooks(String title, String author) {
        return bookRepository.findByTitleContainingOrAuthorContaining(title, author);
    }

    @Override
    public Book saveBook(Book book) {
        //  Check for null dates
        if (book.getPublishedDate() == null) {
            throw new IllegalArgumentException("Published date is required.");
        }

        // Check if published date is in the future
        if (book.getPublishedDate().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Published date cannot be in the future.");
        }

        //  Ensure Hibernate generates a new ID
        book.setBid(null);

        return bookRepository.save(book);
    }


    @Override
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

	@Override
	public Book updateBook(Long bid, Book bookDetails) {
		Book existingBook = bookRepository.findById(bid)
		        .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + bid));

		    existingBook.setTitle(bookDetails.getTitle());
		    existingBook.setAuthor(bookDetails.getAuthor());
		    existingBook.setIsbn(bookDetails.getIsbn());
		    existingBook.setPublisher(bookDetails.getPublisher());
		    existingBook.setPublishedDate(bookDetails.getPublishedDate());
		    existingBook.setEdition(bookDetails.getEdition());
		    existingBook.setGenre(bookDetails.getGenre());
		    existingBook.setDescription(bookDetails.getDescription());
		    existingBook.setLanguage(bookDetails.getLanguage());
		    existingBook.setNumberOfPages(bookDetails.getNumberOfPages());
		    existingBook.setCost(bookDetails.getCost());
		    existingBook.setCategory(bookDetails.getCategory());
		    existingBook.setAvailability(bookDetails.getAvailability());

		    return bookRepository.save(existingBook);
	}

	@Override
	public List<Book> searchBooks(String title, String author, String language, String category) {
	    return bookRepository.findByFilters(title, author, language, category);
	}
}
