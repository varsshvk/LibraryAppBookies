package com.example.Project.LibraryApp.service;


import com.example.Project.LibraryApp.dto.LoginDto;
import com.example.Project.LibraryApp.dto.RegisterRequest;

public interface AuthService {
    String login(LoginDto loginDTO);  // Returns JWT token
    void registerUser(RegisterRequest request);
	Object getUserProfile(String username);
}
