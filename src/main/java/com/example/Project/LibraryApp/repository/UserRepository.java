package com.example.Project.LibraryApp.repository;

import com.example.Project.LibraryApp.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Long> {


    
    Optional<Users> findByUsernameOrEmail(String username, String email);

    Optional <Users> findByUsername(String username);

	Optional<Users> findByEmail(String usernameOrEmail);
}
