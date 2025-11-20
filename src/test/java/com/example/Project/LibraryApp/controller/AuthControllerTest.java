package com.example.Project.LibraryApp.controller;

import com.example.Project.LibraryApp.dto.LoginDto;
import com.example.Project.LibraryApp.dto.RegisterRequest;
import com.example.Project.LibraryApp.jwt.JwtTokenProvider;
import com.example.Project.LibraryApp.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.core.userdetails.UserDetailsService; // 👈 added

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false) //  Disable all security filters
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider; 

    @MockBean
    private UserDetailsService userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    private LoginDto loginDto;
    private RegisterRequest registerRequest;

    @BeforeEach
    void setup() {
        loginDto = new LoginDto();
        loginDto.setUsernameOrEmail("varssha");
        loginDto.setPassword("password123");

        registerRequest = new RegisterRequest();
        registerRequest.setUsername("varssha");
        registerRequest.setEmail("varssha@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setName("Varssha K");
        registerRequest.setGender("Female");
        registerRequest.setAddress("Chennai");
        registerRequest.setContactNumber("9876543210");
        registerRequest.setRole("USER");
    }

    //  Test 1: Login success
    @Test
    void testLogin_Success() throws Exception {
        when(authService.login(any(LoginDto.class))).thenReturn("fake-jwt-token");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"))
                .andExpect(jsonPath("$.username").value("varssha"));
    }

    //  Test 2: Register success
    @Test
    void testRegisterUser_Success() throws Exception {
        Mockito.doNothing().when(authService).registerUser(any(RegisterRequest.class));

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(content().string("User registered successfully!"));
    }

    //  Test 3: Get profile success
    @Test
    void testGetProfile_Success() throws Exception {
        when(authService.getUserProfile("varssha")).thenReturn(
                java.util.Map.of(
                        "id", 1L,
                        "name", "Varssha K",
                        "email", "varssha@example.com",
                        "role", "ROLE_USER"
                )
        );

        mockMvc.perform(get("/api/auth/profile/varssha"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Varssha K"))
                .andExpect(jsonPath("$.role").value("ROLE_USER"));
    }
}
