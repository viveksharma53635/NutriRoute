package com.learn.NutriRoute.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ChatController {

    @GetMapping("/coach-user/{coachId}/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getMessages(@PathVariable String coachId, @PathVariable String userId) {
        return ResponseEntity.ok(List.of(
                Map.of("id", 1, "coachId", coachId, "userId", userId, "sender", "coach", "message", "How is your meal plan going?"),
                Map.of("id", 2, "coachId", coachId, "userId", userId, "sender", "user", "message", "Much better this week.")));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserForChat(@PathVariable String userId) {
        return ResponseEntity.ok(Map.of("id", userId, "fullName", "Frontend Linked User"));
    }

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendMessage(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(Map.of("message", "Message sent", "data", payload));
    }

    @PutMapping("/read/{userId}")
    public ResponseEntity<Map<String, Object>> markMessagesAsRead(@PathVariable String userId) {
        return ResponseEntity.ok(Map.of("message", "Messages marked as read", "userId", userId));
    }

    @GetMapping("/unread/{userId}")
    public ResponseEntity<Map<String, Object>> getUnreadCount(@PathVariable String userId) {
        return ResponseEntity.ok(Map.of("userId", userId, "count", 0));
    }
}
