package com.learn.NutriRoute.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/coach")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CoachController {

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(Map.of(
                "activeClients", 8,
                "pendingMessages", 3,
                "plansCreated", 14));
    }

    @GetMapping("/clients")
    public ResponseEntity<List<Map<String, Object>>> getClients() {
        return ResponseEntity.ok(List.of(
                Map.of("id", "u1", "fullName", "Ananya Singh", "goal", "Weight Loss"),
                Map.of("id", "u2", "fullName", "Rohit Mehta", "goal", "Muscle Gain")));
    }

    @GetMapping("/clients/{clientId}")
    public ResponseEntity<Map<String, Object>> getClientDetails(@PathVariable String clientId) {
        return ResponseEntity.ok(Map.of(
                "id", clientId,
                "fullName", "Client " + clientId,
                "goal", "Weight Loss",
                "currentPlan", "Balanced Cut Plan"));
    }

    @GetMapping("/plans")
    public ResponseEntity<List<Map<String, Object>>> getPlans() {
        return ResponseEntity.ok(List.of(
                Map.of("id", 101, "title", "Balanced Cut Plan", "durationDays", 30),
                Map.of("id", 102, "title", "Lean Bulk Plan", "durationDays", 45)));
    }

    @PostMapping("/plan")
    public ResponseEntity<Map<String, Object>> createPlan(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(Map.of("message", "Coach plan created", "data", payload));
    }

    @PutMapping("/plan/{planId}")
    public ResponseEntity<Map<String, Object>> updatePlan(@PathVariable Long planId, @RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(Map.of("message", "Coach plan updated", "planId", planId, "data", payload));
    }

    @DeleteMapping("/plan/{planId}")
    public ResponseEntity<Map<String, Object>> deletePlan(@PathVariable Long planId) {
        return ResponseEntity.ok(Map.of("message", "Coach plan deleted", "planId", planId));
    }
}
