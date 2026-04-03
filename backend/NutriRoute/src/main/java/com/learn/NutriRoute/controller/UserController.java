package com.learn.NutriRoute.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.learn.NutriRoute.dtos.UserDto;
import com.learn.NutriRoute.services.UserService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile(Authentication authentication) {
        return ResponseEntity.ok(userService.getUserByEmail(authentication.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(Authentication authentication, @RequestBody UserDto userDto) {
        UserDto user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(userService.updateUser(user.getId(), userDto));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(Authentication authentication) {
        UserDto user = userService.getUserByEmail(authentication.getName());
        List<Map<String, Object>> quickStats = List.of(
                Map.of("label", "Calories Today", "value", 1850),
                Map.of("label", "Meals Logged", "value", 4),
                Map.of("label", "Water Intake", "value", "2.4L"));

        return ResponseEntity.ok(Map.of(
                "userId", user.getId(),
                "name", user.getFullName(),
                "goal", user.getGoal(),
                "quickStats", quickStats));
    }

    @GetMapping("/progress")
    public ResponseEntity<List<Map<String, Object>>> getProgress(Authentication authentication) {
        return ResponseEntity.ok(List.of(
                Map.of("date", "2026-04-01", "weightKg", 78.4, "calories", 1800),
                Map.of("date", "2026-04-02", "weightKg", 78.1, "calories", 1760),
                Map.of("date", "2026-04-03", "weightKg", 77.9, "calories", 1710)));
    }
}
