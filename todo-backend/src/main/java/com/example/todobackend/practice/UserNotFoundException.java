package com.example.todobackend.practice;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String username) {
        super("ユーザーが見つかりません: " + username);
    }
}
