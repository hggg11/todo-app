package com.example.todobackend.practice;

public class UserValidator implements Validator<String> {
    public void validate(String value) {
        if (value == null || value.isEmpty()) {
            throw new UserNotFoundException(value);
        }
    }
}
