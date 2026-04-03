package com.learn.NutriRoute.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.learn.NutriRoute.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // Find user by email (used in login)
    Optional<User> findByEmail(String email);

    // Search users by full name
    List<User> findByFullName(String fullName);

    // Check if email already exists (used in register)
    boolean existsByEmail(String email);

}