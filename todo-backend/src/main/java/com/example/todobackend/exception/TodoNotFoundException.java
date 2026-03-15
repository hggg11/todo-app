package com.example.todobackend.exception;

public class TodoNotFoundException extends RuntimeException {
    public TodoNotFoundException(Long id,  String username) {
        super(String.format("(ID: %d, Username: %d)が見つかりませんでした。", id, username));
    }
}
