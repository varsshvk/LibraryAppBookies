package com.example.Project.LibraryApp.service;

import com.example.Project.LibraryApp.entity.Reservation;
import com.example.Project.LibraryApp.entity.Users;
import com.example.Project.LibraryApp.exception.ResourceNotFoundException;
import com.example.Project.LibraryApp.entity.Book;
import com.example.Project.LibraryApp.repository.BookRepository;
import com.example.Project.LibraryApp.repository.ReservationRepository;
import com.example.Project.LibraryApp.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BookRepository bookRepository;
    @Override
    public Reservation reserveBook(Users user, Book book) {
        Users existingUser = userRepository.findById(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + user.getId()));

        Book existingBook = bookRepository.findById(book.getBid())
            .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + book.getBid()));

        Reservation reservation = new Reservation();
        reservation.setUser(existingUser);
        reservation.setBook(existingBook);
        reservation.setReservationDate(LocalDate.now());
        reservation.setStatus(Reservation.ReservationStatus.PENDING);


        return reservationRepository.save(reservation);
    }


    @Override
    public List<Reservation> getReservationsByUserId(Long userId) {
        return reservationRepository.findByUser_Id(userId);
    }
    
    @Override
    public List<Reservation> getReservationsByUserName(String userName) {
        return reservationRepository.findByUser_Name(userName);
    }

	@Override
	public List<Reservation> getAllReservations() {
		// TODO Auto-generated method stub
		return reservationRepository.findAll();
	}


	@Override
	public void deleteReservationByUser(Long id, String username) {
		// TODO Auto-generated method stub
		 Reservation reservation = reservationRepository.findById(id)
		            .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with ID: " + id));

		    // Check if user matches or admin
		    Users user = reservation.getUser();
		    if (!user.getUsername().equals(username)) {
		        throw new AccessDeniedException("You are not authorized to delete this reservation");
		    }

		    reservationRepository.delete(reservation);
	}

}
