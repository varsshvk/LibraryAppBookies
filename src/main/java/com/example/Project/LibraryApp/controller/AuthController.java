package com.example.Project.LibraryApp.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Project.LibraryApp.dto.JwtResponseDto;
import com.example.Project.LibraryApp.dto.LoginDto;
import com.example.Project.LibraryApp.dto.RegisterRequest;
import com.example.Project.LibraryApp.service.AuthService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponseDto> login(@RequestBody LoginDto loginDto) {
        String token = authService.login(loginDto);

        JwtResponseDto jwtResponseDto = new JwtResponseDto();
        jwtResponseDto.setToken(token);
        jwtResponseDto.setUsername(loginDto.getUsernameOrEmail()); // ✅ Add this line
        return new ResponseEntity<>(jwtResponseDto, HttpStatus.OK);
    }
    
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest request) {
        try {
            authService.registerUser(request);
            return ResponseEntity.ok("User registered successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    @PostMapping("/admin/create")
    @PreAuthorize("hasRole('ADMIN')") // Only admin users can call this endpoint
    public ResponseEntity<String> registerAdmin(@RequestBody RegisterRequest request) {
        try {
            // Force admin role by code, ignore user input role
            request.setRole("ADMIN");
            authService.registerUser(request);
            return ResponseEntity.ok("Admin registered successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getProfileByUsername(@PathVariable String username) {
        try {
            Object profile = authService.getUserProfile(username);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching profile: " + e.getMessage());
        }
    }


}
