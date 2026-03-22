package com.example.todobackend.practice;

public interface Validator<T> {
    void validate(T value);

    default boolean isValid(T value) {
        try {
            validate(value);
            return true;
        } catch (RuntimeException e) {
            return false;
        }
    }
}
