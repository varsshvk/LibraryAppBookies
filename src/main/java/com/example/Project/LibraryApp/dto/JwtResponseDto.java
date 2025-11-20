package com.example.Project.LibraryApp.dto;


import java.util.Set;

public class JwtResponseDto {
    private String token;       // The JWT token
    private String type = "Bearer";  // Token type, default is Bearer
    private String username; //  Add this field

    // getters & setters
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    // Default constructor
    public JwtResponseDto() {}

    // Constructor with fields
    public JwtResponseDto(String token, String username, Set<String> roles) {
        this.token = token;
        
    }

    // Getters & Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

	


	
	}