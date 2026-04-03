package com.learn.NutriRoute.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class MealController {

    @GetMapping("/meals")
    public ResponseEntity<List<Map<String, Object>>> getMeals() {
        return ResponseEntity.ok(List.of(
                Map.of("id", 1, "name", "Oats Bowl", "calories", 320, "protein", 14),
                Map.of("id", 2, "name", "Grilled Chicken Salad", "calories", 410, "protein", 36),
                Map.of("id", 3, "name", "Paneer Wrap", "calories", 390, "protein", 22)));
    }

    @GetMapping("/meal-log/today")
    public ResponseEntity<List<Map<String, Object>>> getTodayMealLog() {
        return ResponseEntity.ok(List.of(
                Map.of("id", 1001, "mealName", "Oats Bowl", "mealTime", "BREAKFAST", "calories", 320),
                Map.of("id", 1002, "mealName", "Grilled Chicken Salad", "mealTime", "LUNCH", "calories", 410)));
    }

    @GetMapping("/meal-log/history")
    public ResponseEntity<List<Map<String, Object>>> getMealLogHistory() {
        return ResponseEntity.ok(List.of(
                Map.of("date", "2026-04-01", "totalCalories", 1820),
                Map.of("date", "2026-04-02", "totalCalories", 1760),
                Map.of("date", "2026-04-03", "totalCalories", 1710)));
    }

    @PostMapping("/meal-log")
    public ResponseEntity<Map<String, Object>> addMealLog(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(Map.of(
                "message", "Meal log saved",
                "data", payload));
    }

    @DeleteMapping("/meal-log/{mealLogId}")
    public ResponseEntity<Map<String, String>> deleteMealLog(@PathVariable Long mealLogId) {
        return ResponseEntity.ok(Map.of("message", "Meal log deleted", "mealLogId", String.valueOf(mealLogId)));
    }
}
