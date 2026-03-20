package com.example.todobackend.practice;

public class Maybe<T> {
    private final T value;
    private Maybe(T value) {
        this.value = value;
    }
    public static <T> Maybe<T> of (T value) {
        return new Maybe<>(value);
    }
    public static <T> Maybe<T> empty () {
        return new Maybe<>(null);
    }
    public boolean isPresent () {
        return this.value != null;
    }
    public T getValue () throws RuntimeException {
        if (!this.isPresent()) {
            throw new RuntimeException("値が存在しません（Maybe.empty）");
        }
        return this.value;
    }
    public T  orElse  (T defaultValue) {
        return this.isPresent() ? this.getValue() : defaultValue;
    }

    public static void main(String[] args) {
        Maybe<String> full  = Maybe.of("hello");
        Maybe<String> empty = Maybe.empty();

        System.out.println(full.isPresent());        // → true
        System.out.println(full.getValue());         // → hello
        System.out.println(full.orElse("default"));  // → hello

        System.out.println(empty.isPresent());        // → false
        System.out.println(empty.orElse("default"));  // → default
        System.out.println(empty.getValue());         // → RuntimeException
    }
}
