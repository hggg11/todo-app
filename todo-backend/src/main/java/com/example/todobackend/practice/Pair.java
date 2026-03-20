package com.example.todobackend.practice;

import java.util.List;

public class Pair<A, B> {
    private final A first;
    private final B second;

    public Pair(A first, B second) {
        this.first = first;
        this.second = second;
        System.out.println(this.first + "," + this.second);
    }

    public A getFirst() {
        return this.first;
    }

    public B getSecond() {
        return this.second;
    }
    public static void main(String[] args) {
        Pair<String, Integer> pair = new  Pair<>("Alice", 30);
        System.out.println("name:" + pair.getFirst());
        System.out.println("age:" + pair.getSecond());
        Utils.findMax(List.of(3, 1, 4, 1, 5)).ifPresent(max -> System.out.println("最大値：　" + max));
        Utils.findMax(List.of("banana", "apple")).ifPresent(max -> System.out.println("最大値：　" + max));
    }
}