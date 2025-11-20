package com.example.Project.LibraryApp.service;

import com.example.Project.LibraryApp.dto.LoginDto;
import com.example.Project.LibraryApp.dto.RegisterRequest;
import com.example.Project.LibraryApp.entity.Roles;
import com.example.Project.LibraryApp.entity.Users;
import com.example.Project.LibraryApp.jwt.JwtTokenProvider;
import com.example.Project.LibraryApp.repository.RoleRepository;
import com.example.Project.LibraryApp.repository.UserRepository;
import com.example.Project.LibraryApp.service.AuthService;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    private EmailService emailService;
    
    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public String login(LoginDto loginDTO) {
        //  Authenticate user/admin
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getUsernameOrEmail(),
                        loginDTO.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        //  Generate JWT token
        String token = jwtTokenProvider.generateToken(authentication);

        //  Find user by username OR email
        Users user = userRepository.findByUsername(loginDTO.getUsernameOrEmail())
                .orElseGet(() -> userRepository.findByEmail(loginDTO.getUsernameOrEmail()).orElse(null));

        if (user != null) {
            try {
                String subject = " Login Notification - Library System";
                String body = "Dear " + user.getName() + ",\n\n" +
                        "You have successfully logged in to the Library Management System.\n" +
                        "If this was not you, please contact the administrator immediately.\n\n" +
                        "Warm regards,\nLibrary Admin Team";

                //  Send to user
                emailService.sendEmail(user.getEmail(), subject, body);

                //  Optional: notify admin
                emailService.sendEmail("varsshakrishna16@example.com", "User Login Alert",
                        "User " + user.getUsername() + " logged in at " + java.time.LocalDateTime.now());

                System.out.println(" Login notification emails sent successfully!");
            } catch (Exception e) {
                System.err.println(" Error sending login email: " + e.getMessage());
            }
        } else {
            System.err.println(" No matching user found to send email.");
        }

        return token;
    }


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    

	public void registerUser(RegisterRequest request) {
		if (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) {
		    throw new IllegalStateException("Admin self-registration is not allowed");
		}

		// TODO Auto-generated method stub
    	Optional<Users> existingUser = userRepository.findByUsernameOrEmail(request.getUsername(), request.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Username or Email already in use!");
		
	}
     // Create new User
        Users user = new Users();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAddress(request.getAddress());
        user.setContactNumber(request.getContactNumber());
        user.setGender(request.getGender());
        
        // Fetch role from DB
        Roles roles;
        if (request.getRole() != null) {
            roles = roleRepository.findByName("ROLE_" + request.getRole().toUpperCase())
                    .orElseThrow(() -> new RuntimeException("Role not found"));
        } else {
            // Default role USER
            roles = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("Default USER role not found"));
        }

        user.setRoles(Collections.singleton(roles));

        // Save user
        userRepository.save(user);
    }

	@Override
	public Object getUserProfile(String username) {
	    Users user = userRepository.findByUsername(username)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    Map<String, Object> profile = new HashMap<>();
	    profile.put("id", user.getId());
	    profile.put("name", user.getName());
	    profile.put("email", user.getEmail());
	    profile.put("role", user.getRoles().stream().findFirst().get().getName());
	    profile.put("address", user.getAddress());
	    profile.put("contactNumber", user.getContactNumber());
	    profile.put("gender", user.getGender());
	    return profile;
	}

 
    
}

