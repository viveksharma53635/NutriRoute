package com.learn.NutriRoute.security;

import com.learn.NutriRoute.dtos.UserDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {

    private boolean success;
    private String token;
    private UserDto userDto;
    private String message;

    public LoginResponse(String token, UserDto userDto) {
        this.success = true;
        this.token = token;
        this.userDto = userDto;
        this.message = "Login successful";
    }

    public LoginResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}
