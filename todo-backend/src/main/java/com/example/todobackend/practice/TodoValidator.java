package com.example.todobackend.practice;

import com.example.todobackend.entity.Todo;

public class TodoValidator {
    record TodoResult(String username, String priority) {}
    public static void validatePriority(String priority) {
        if (!(priority.equals("HIGH") || priority.equals("MEDIUM") || priority.equals("LOW"))) {
            throw new InvalidPriorityException(priority);
        }
    }

    public static void validateUser(String username) {
        if (username == null || username.isEmpty()) throw new UserNotFoundException(username);
    }

    public static TodoResult findAndValidate(String username, String priority) {
        try {
            validateUser(username);
            validatePriority(priority);
            return new TodoResult(username, priority); // 仮
        } catch (UserNotFoundException | InvalidPriorityException e) {
            // 複数の例外を1つのcatchで捕まえる（multi-catch）
            throw new RuntimeException("Todoの検証に失敗しました", e); // e を cause として渡す
        }
    }

    public static void main (String[] args) {
        try {
            findAndValidate("admin", "INVALID");
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
            System.out.println(e.getCause().getMessage());
        }

        System.out.println("Done");
    }
}
