package com.example.todobackend.exception;

public class TodoNotFoundException extends RuntimeException {
    public TodoNotFoundException(Long id) {
        super(String.format("Todo (ID: %d)が見つかりませんでした。", id));
    }
}
