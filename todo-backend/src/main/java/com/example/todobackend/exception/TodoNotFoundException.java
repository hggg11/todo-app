package com.example.todobackend.exception;

public class TodoNotFoundException extends RuntimeException {
    // コンストラクタに何を書けばいいでしょう？
    public TodoNotFoundException(Long id) {
        super(String.format("(ID: %d)が見つかりませんでした。", id));
    }
}
