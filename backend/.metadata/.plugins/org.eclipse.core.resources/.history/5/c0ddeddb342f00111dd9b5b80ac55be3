package com.learn.NutriRoute.services;

import java.util.List;

import com.learn.NutriRoute.dtos.UserDto;

public interface UserService {

    UserDto registerUser(UserDto userDto);

    boolean checkEmail(String email);

    UserDto getUserById(String userId);

    UserDto getUserByEmail(String email);

    List<UserDto> getAllUsers();

    List<UserDto> getUsersByRole(String roleName);

    UserDto updateUser(String userId, UserDto userDto);

    void deleteUser(String userId);

    boolean existsByEmail(String email);
}
