package com.example.todobackend.practice;

public abstract class BaseValidator<T> {
    public void validate(T value) {
        System.out.println("バリデーション開始: " + value);
        doValidate(value);
    }
    protected abstract void doValidate(T value);
}
