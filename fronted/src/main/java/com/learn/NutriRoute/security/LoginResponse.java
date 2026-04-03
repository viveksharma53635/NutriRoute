package com.learn.NutriRoute.security;



import com.learn.NutriRoute.dtos.UserDto;
import com.learn.NutriRoute.entities.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
	
	private String token;
	private User userDto;

}

