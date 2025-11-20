package com.example.Project.LibraryApp.service;

import com.example.Project.LibraryApp.entity.Users;

public interface UserService {
    Users getCurrentUser(String username);
    Users updateUserProfile(String username, Users updatedUser);
    void changePassword(String username, String oldPassword, String newPassword);
}

