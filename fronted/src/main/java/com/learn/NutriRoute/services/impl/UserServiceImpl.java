package com.learn.NutriRoute.services.impl;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.learn.NutriRoute.dtos.UserDto;
import com.learn.NutriRoute.entities.Role;
import com.learn.NutriRoute.entities.User;
import com.learn.NutriRoute.enums.AppRole;
import com.learn.NutriRoute.repository.RoleRepository;
import com.learn.NutriRoute.repository.UserRepository;
import com.learn.NutriRoute.services.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    @Autowired
	private PasswordEncoder passwordEncoder;
 
    public UserServiceImpl(
            ModelMapper modelMapper,
            UserRepository userRepository,
            RoleRepository roleRepository)
        {

        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
       
    }

    @Override
    public UserDto registerUser(UserDto userDto) {

        // Check if email already exists
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        // DTO → Entity
        User user = modelMapper.map(userDto, User.class);
        
        

        // Assign default role
        Role role = roleRepository.findByRoleName(AppRole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.setRole(role);

        // Save user
        User savedUser = userRepository.save(user);

        // Entity → DTO
        return modelMapper.map(savedUser, UserDto.class);
    }

    @Override
    public boolean checkEmail(String email) {
        return userRepository.existsByEmail(email);
    }

	@Override
	public UserDto getUserById(String userId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public UserDto getUserByEmail(String email) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<UserDto> getAllUsers() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public UserDto updateUser(String userId, UserDto userDto) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deleteUser(String userId) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public boolean existsByEmail(String email) {
		// TODO Auto-generated method stub
		return false;
	}

	
}