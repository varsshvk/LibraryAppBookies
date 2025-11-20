package com.example.Project.LibraryApp.service;

import com.example.Project.LibraryApp.entity.BorrowedBook;
import com.example.Project.LibraryApp.entity.Users;
import com.example.Project.LibraryApp.repository.BorrowedBookRepository;
import com.example.Project.LibraryApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OverdueNotificationScheduler {

    @Autowired
    private BorrowedBookRepository borrowedBookRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    //  Runs every day at 9 AM
   @Scheduled(cron = "0 0 9 * * ?")
   // @Scheduled(fixedRate = 60000)

    public void sendOverdueEmails() {
        System.out.println("Running overdue book check at " + LocalDate.now());

        // Fetch all borrowed books that are not returned and past due
        List<BorrowedBook> overdueBooks = borrowedBookRepository.findAll().stream()
                .filter(b -> b.getReturnDate() != null && b.getReturnDate().isBefore(LocalDate.now()))
                .filter(b -> b.getFineAmount() > 0)
                .collect(Collectors.toList());

        if (overdueBooks.isEmpty()) {
            System.out.println(" No overdue books found today.");
            return;
        }

        // Notify each user about their overdue books
        for (BorrowedBook book : overdueBooks) {
            Users user = book.getUser();

            String userMailSubject = " Overdue Book Reminder - Library Management System";
            String userMailBody = String.format(
                    "Dear %s,\n\nThis is a reminder that your borrowed book '%s' was due on %s.\n" +
                    "Your current fine amount is ₹%.2f.\n\n" +
                    "Please return the book as soon as possible to avoid further fines.\n\n" +
                    "Regards,\nLibrary Management System",
                    user.getName(),
                    book.getBook().getTitle(),
                    book.getReturnDate(),
                    book.getFineAmount()
            );

            // Send mail to user
            emailService.sendEmail(user.getEmail(), userMailSubject, userMailBody);

            // Send summary to admin
            String adminMailSubject = " Overdue Book Alert - " + user.getUsername();
            String adminMailBody = String.format(
                    "User: %s\nEmail: %s\nBook: %s\nDue Date: %s\nFine: ₹%.2f\n\nPlease follow up accordingly.",
                    user.getUsername(),
                    user.getEmail(),
                    book.getBook().getTitle(),
                    book.getReturnDate(),
                    book.getFineAmount()
            );

            emailService.sendEmail("admin.library@example.com", adminMailSubject, adminMailBody);
        }

        System.out.println(" Overdue notifications sent successfully!");
    }
}
