package com.example.Project.LibraryApp.controller;

import com.example.Project.LibraryApp.service.EmailService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmailTestController {

    private final EmailService emailService;

    public EmailTestController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/test-email")
    public String testEmail() {
        emailService.sendEmail(
            "varsshakrishna16@example.com",
            "Library Test Mail",
            "This is a test email from your Library App system!"
        );
        return "Test email sent!";
    }
}
