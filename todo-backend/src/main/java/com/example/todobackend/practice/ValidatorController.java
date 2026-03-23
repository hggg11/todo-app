package com.example.todobackend.practice;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ValidatorController {

    private final ValidatorService validatorService;

    @GetMapping("/api/validate")
    public boolean validate (@RequestParam String priority) {
        return validatorService.validatePriority(priority);
    }
}
