package com.example.Project.LibraryApp.Mapper;

import com.example.Project.LibraryApp.dto.ReservationDTO;
import com.example.Project.LibraryApp.entity.Reservation;
import com.example.Project.LibraryApp.entity.Users;
import com.example.Project.LibraryApp.entity.Book;

public class ReservationMapper {
	public static ReservationDTO toDTO(Reservation reservation) {
	    ReservationDTO dto = new ReservationDTO();
	    dto.setId(reservation.getId());

	    if (reservation.getUser() != null) {
	        dto.setUserId(reservation.getUser().getId());
	    } else {
	        dto.setUserId(null);
	    }

	    if (reservation.getBook() != null) {
	        dto.setBookId(reservation.getBook().getBid());
	    } else {
	        dto.setBookId(null);
	    }

	    dto.setBookTitle(reservation.getBook().getTitle()); // ✅ FIXED HERE
	    dto.setReservationDate(reservation.getReservationDate());

	    if (reservation.getStatus() != null) {
	        dto.setStatus(reservation.getStatus().name());
	    } else {
	        dto.setStatus(null);
	    }

	    return dto;
	}

    public static Reservation toEntity(ReservationDTO dto) {
        Reservation reservation = new Reservation();
        reservation.setId(dto.getId());
        reservation.setUser(new Users(dto.getUserId()));
        reservation.setBook(new Book(dto.getBookId()));
        reservation.setReservationDate(dto.getReservationDate());
        reservation.setStatus(Reservation.ReservationStatus.valueOf(dto.getStatus()));
        return reservation;
    }
}
