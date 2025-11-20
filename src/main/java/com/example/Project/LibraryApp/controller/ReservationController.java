package com.example.Project.LibraryApp.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.Project.LibraryApp.Mapper.ReservationMapper;
import com.example.Project.LibraryApp.dto.ReservationDTO;
import com.example.Project.LibraryApp.entity.Book;
import com.example.Project.LibraryApp.entity.Reservation;
import com.example.Project.LibraryApp.entity.Users;
import com.example.Project.LibraryApp.exception.ResourceNotFoundException;
import com.example.Project.LibraryApp.repository.UserRepository;
import com.example.Project.LibraryApp.service.ReservationService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.List;
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private UserRepository userRepository;
    
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/all")
    public List<ReservationDTO> getAllReservations() {
        List<Reservation> reservations = reservationService.getAllReservations();
        return reservations.stream()
                .map(ReservationMapper::toDTO)
                .toList();
    }
    @PostMapping("/reserve")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ReservationDTO reserveBook(@RequestBody ReservationDTO reservationDTO, Authentication authentication) {
        String username = authentication.getName();

        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Book book = new Book(reservationDTO.getBookId());
        Reservation reservation = reservationService.reserveBook(user, book);

        return ReservationMapper.toDTO(reservation);
    }


    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/user/{id}")
    public List<ReservationDTO> getReservationsByUser(@PathVariable Long id) {
        List<Reservation> reservations = reservationService.getReservationsByUserId(id);
        return reservations.stream()
                .map(ReservationMapper::toDTO)
                .toList();
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/user/name/{userName}")
    public List<ReservationDTO> getReservationsByUserName(@PathVariable String userName) {
        List<Reservation> reservations = reservationService.getReservationsByUserName(userName);
        return reservations.stream()
                .map(ReservationMapper::toDTO)
                .toList();
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReservation(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();

        try {
            reservationService.deleteReservationByUser(id, username);
            return ResponseEntity.ok(" Reservation deleted successfully!");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(" Reservation not found!");
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(" You can only delete your own reservations!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("⚠ Error deleting reservation!");
        }
    }

}
