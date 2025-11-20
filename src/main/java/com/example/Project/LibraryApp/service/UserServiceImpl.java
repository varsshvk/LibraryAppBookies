package com.example.Project.LibraryApp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Project.LibraryApp.entity.Users;
import com.example.Project.LibraryApp.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Users getCurrentUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public Users updateUserProfile(String username, Users updatedUser) {
        Users existingUser = getCurrentUser(username);
        existingUser.setName(updatedUser.getName());
        existingUser.setContactNumber(updatedUser.getContactNumber());
        existingUser.setAddress(updatedUser.getAddress());
        existingUser.setProfilePicture(updatedUser.getProfilePicture());
        return userRepository.save(existingUser);
    }

    @Override
    public void changePassword(String username, String oldPassword, String newPassword) {
        Users user = getCurrentUser(username);
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}

