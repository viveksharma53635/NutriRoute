package com.learn.NutriRoute.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.learn.NutriRoute.dtos.UserDto;
import com.learn.NutriRoute.services.UserService;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {


	@Autowired
	private UserService userService;
	@PostMapping("/register")
	public ResponseEntity<UserDto> register(@RequestBody UserDto userDto)
	{
	    UserDto savedUser = userService.registerUser(userDto);
		return new ResponseEntity<UserDto>(savedUser,HttpStatus.CREATED); 
		 
    }
}


