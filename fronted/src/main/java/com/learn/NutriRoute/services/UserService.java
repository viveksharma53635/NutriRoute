package com.learn.NutriRoute.services;

import java.util.List;

import com.learn.NutriRoute.dtos.UserDto;

public interface UserService {

    // Register new user
    UserDto registerUser(UserDto userDto);

    // Check if email already exists
    boolean checkEmail(String email);

    // Get user by ID
    UserDto getUserById(String userId);

    // Get user by email (login purpose)
    UserDto getUserByEmail(String email);

    // Get all users (admin dashboard)
    List<UserDto> getAllUsers();

    // Update user profile
    UserDto updateUser(String userId, UserDto userDto);

    // Delete user
    void deleteUser(String userId);

	boolean existsByEmail(String email);
}