package com.example.todobackend.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String username) {
        super(String.format("User with name %s not found", username));
    }
}
