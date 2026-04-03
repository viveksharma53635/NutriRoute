package com.learn.NutriRoute.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.learn.NutriRoute.entities.User;
import com.learn.NutriRoute.repository.UserRepository;



@Service

public class UserDetailsImpl implements UserDetailsService{
	@Autowired
	private UserRepository userReposotory;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		User user = userReposotory.findByEmail(username)
		.orElseThrow(()->new RuntimeException("Email  not found"));
		return user;
	}

}
