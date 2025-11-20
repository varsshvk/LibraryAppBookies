package com.example.Project.LibraryApp.service;

import com.example.Project.LibraryApp.entity.PasswordResetToken;
import com.example.Project.LibraryApp.entity.Users;
import com.example.Project.LibraryApp.repository.PasswordResetTokenRepository;
import com.example.Project.LibraryApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public void createPasswordResetToken(String email) {
        Optional<Users> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("No user found with that email");
        }

        Users user = userOpt.get();

        // Generate token
        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken(token, user, LocalDateTime.now().plusMinutes(30));
        tokenRepository.save(resetToken);

        // Send reset email
        String resetLink = "http://localhost:5173/reset-password/" + token;
        String subject = " Password Reset Request";
        String body = "Dear " + user.getName() + ",\n\n" +
                "You requested to reset your password.\n" +
                "Click the link below to set a new password:\n" +
                resetLink + "\n\n" +
                "This link will expire in 30 minutes.\n\n" +
                "If you didn’t request this, please ignore it.\n\n" +
                "– Library Admin Team";

        emailService.sendEmail(user.getEmail(), subject, body);
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token has expired");
        }

        Users user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }
}
