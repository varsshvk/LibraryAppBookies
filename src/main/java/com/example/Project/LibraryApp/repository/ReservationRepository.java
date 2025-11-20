package com.example.Project.LibraryApp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Project.LibraryApp.entity.Book;
import com.example.Project.LibraryApp.entity.Reservation;
import com.example.Project.LibraryApp.entity.Users;

import java.util.List;


public interface ReservationRepository extends JpaRepository<Reservation, Long> {

	List<Reservation> findByUser_Id(Long userId);

	List<Reservation> findByUser(Users user);

	List<Reservation> findByUser_Name(String userName);

}

