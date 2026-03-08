package com.example.todobackend.controller;

import com.example.todobackend.dto.LoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth/login")
@RequiredArgsConstructor
public class LoginController {
    @PostMapping
    public String login(@RequestBody LoginRequest request) {
        // ひとまず固定トークンを返す
        return "dummy-token";
    }
}
