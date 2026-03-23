package com.example.todobackend.practice;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@RequiredArgsConstructor
@Service
public class ValidatorService {
    private final Validator<String> priorityValidator;

    boolean validatePriority(String priority){
        return priorityValidator.isValid(priority);
    }
}
