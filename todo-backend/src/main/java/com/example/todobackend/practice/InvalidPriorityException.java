package com.example.todobackend.practice;

public class InvalidPriorityException extends RuntimeException {
    public InvalidPriorityException(String priority) {
        super("不正な優先度です: "+ priority);
    }
}
