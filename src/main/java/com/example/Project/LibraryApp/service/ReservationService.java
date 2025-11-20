package com.example.Project.LibraryApp.service;

import com.example.Project.LibraryApp.entity.Reservation;
import com.example.Project.LibraryApp.entity.Users;
import com.example.Project.LibraryApp.entity.Book;

import java.util.List;

public interface ReservationService {
	Reservation reserveBook(Users user, Book book);
	List<Reservation> getReservationsByUserId(Long userId);
	List<Reservation> getReservationsByUserName(String userName);
	List<Reservation> getAllReservations();
	void deleteReservationByUser(Long id, String username);

}
