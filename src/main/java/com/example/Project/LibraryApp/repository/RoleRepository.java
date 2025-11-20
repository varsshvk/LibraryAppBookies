package com.example.Project.LibraryApp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Project.LibraryApp.entity.Roles;

public interface RoleRepository extends JpaRepository<Roles, Long>{
	 Optional<Roles> findByName(String name);
}
