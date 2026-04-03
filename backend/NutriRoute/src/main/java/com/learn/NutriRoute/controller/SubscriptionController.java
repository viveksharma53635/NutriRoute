package com.learn.NutriRoute.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subscription")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class SubscriptionController {

    @GetMapping("/plans")
    public ResponseEntity<List<Map<String, Object>>> getPlans() {
        return ResponseEntity.ok(List.of(
                Map.of("name", "FREE", "price", 0, "features", List.of("basic tracking")),
                Map.of("name", "PRO", "price", 499, "features", List.of("coach chat", "diet plans")),
                Map.of("name", "PREMIUM", "price", 999, "features", List.of("all features", "priority coach"))));
    }

    @GetMapping("/current")
    public ResponseEntity<Map<String, Object>> getCurrentSubscription() {
        return ResponseEntity.ok(Map.of("plan", "FREE", "status", "ACTIVE"));
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        return ResponseEntity.ok(Map.of("status", "ACTIVE", "plan", "FREE"));
    }

    @GetMapping("/check-access/{plan}")
    public ResponseEntity<Map<String, Object>> checkPlanAccess(@PathVariable String plan) {
        return ResponseEntity.ok(Map.of("allowed", true, "requiredPlan", plan));
    }

    @GetMapping("/check-feature/{feature}")
    public ResponseEntity<Map<String, Object>> checkFeatureAccess(@PathVariable String feature) {
        return ResponseEntity.ok(Map.of("allowed", true, "feature", feature));
    }

    @PostMapping("/upgrade")
    public ResponseEntity<Map<String, Object>> upgradePlan(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(Map.of("message", "Subscription upgraded", "data", payload));
    }

    @PostMapping("/razorpay/order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(Map.of(
                "orderId", "order_demo_123",
                "amount", 49900,
                "currency", "INR",
                "payload", payload));
    }

    @PostMapping("/razorpay/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(Map.of("verified", true, "payload", payload));
    }

    @GetMapping("/admin/subscriptions")
    public ResponseEntity<List<Map<String, Object>>> getAdminSubscriptions() {
        return ResponseEntity.ok(List.of(
                Map.of("user", "Ananya Singh", "plan", "PRO", "status", "ACTIVE"),
                Map.of("user", "Rohit Mehta", "plan", "PREMIUM", "status", "ACTIVE")));
    }

    @GetMapping("/admin/payments")
    public ResponseEntity<List<Map<String, Object>>> getAdminPayments() {
        return ResponseEntity.ok(List.of(
                Map.of("paymentId", "pay_001", "amount", 499, "status", "SUCCESS"),
                Map.of("paymentId", "pay_002", "amount", 999, "status", "SUCCESS")));
    }
}
