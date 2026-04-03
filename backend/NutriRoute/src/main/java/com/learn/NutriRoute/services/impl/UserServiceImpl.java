package com.learn.NutriRoute.services.impl;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.learn.NutriRoute.dtos.UserDto;
import com.learn.NutriRoute.entities.Role;
import com.learn.NutriRoute.entities.User;
import com.learn.NutriRoute.enums.AppRole;
import com.learn.NutriRoute.repository.RoleRepository;
import com.learn.NutriRoute.repository.UserRepository;
import com.learn.NutriRoute.services.UserService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(
            ModelMapper modelMapper,
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDto registerUser(UserDto userDto) {
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = modelMapper.map(userDto, User.class);
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setRole(resolveRole(userDto));

        return modelMapper.map(userRepository.save(user), UserDto.class);
    }

    @Override
    public boolean checkEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public UserDto getUserById(String userId) {
        User user = userRepository.findWithRoleById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findWithRoleByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<UserDto> getAllUsers() {
        return userRepository.findAllWithRole().stream()
                .map(user -> modelMapper.map(user, UserDto.class))
                .toList();
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<UserDto> getUsersByRole(String roleName) {
        AppRole appRole = AppRole.valueOf(roleName);
        return userRepository.findByRoleRoleName(appRole).stream()
                .map(user -> modelMapper.map(user, UserDto.class))
                .toList();
    }

    @Override
    public UserDto updateUser(String userId, UserDto userDto) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setFullName(userDto.getFullName());
        existingUser.setAge(userDto.getAge());
        existingUser.setGender(userDto.getGender());
        existingUser.setWeightKg(userDto.getWeightKg());
        existingUser.setHeightCm(userDto.getHeightCm());
        existingUser.setProfession(userDto.getProfession());
        existingUser.setGoal(userDto.getGoal());

        if (userDto.getPassword() != null && !userDto.getPassword().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }

        if (userDto.getRole() != null && userDto.getRole().getRoleName() != null) {
            existingUser.setRole(resolveRole(userDto));
        }

        return modelMapper.map(userRepository.save(existingUser), UserDto.class);
    }

    @Override
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    private Role resolveRole(UserDto userDto) {
        final AppRole roleName = userDto.getRole() != null && userDto.getRole().getRoleName() != null
                ? userDto.getRole().getRoleName()
                : AppRole.ROLE_USER;

        return roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
    }
}
