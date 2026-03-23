package com.example.todobackend.practice;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class GreetingController {
    private final GreetingService greetingService;
    @GetMapping("/api/greeting")
    public String greet(@RequestParam String username) {
        return greetingService.greeting(username);
    }
}
