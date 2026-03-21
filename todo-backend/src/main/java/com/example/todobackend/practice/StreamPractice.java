package com.example.todobackend.practice;

import java.util.List;
import java.util.stream.Collectors;

public class StreamPractice {
    record TodoItem(String title, String priority, boolean completed) {}


    public static void main(String[] args) {
        List<TodoItem> todos = List.of(
                new TodoItem("買い物",    "HIGH",   false),
                new TodoItem("読書",      "LOW",    true),
                new TodoItem("運動",      "HIGH",   false),
                new TodoItem("掃除",      "MEDIUM", true),
                new TodoItem("勉強",      "HIGH",   true)
        );
        List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        List <Integer> valList = numbers.stream()
                                        .filter(x -> x % 2 == 0)
                                        .map(x -> 2 * x)
                                        .collect(Collectors.toList());
        // No.1
        String result = valList.stream().map(String::valueOf).collect(Collectors.joining(","));
        System.out.println(result);
        // No.2
        System.out.println(numbers.stream().reduce(0, (total, x) -> total + x));

        // No.3
        List<String> titleList =
                todos.stream().filter(x -> !x.completed()).map(TodoItem::title).collect(Collectors.toList());
        System.out.println(titleList);
        long count = todos.stream().filter(x -> x.priority().equals("HIGH") && !x.completed()).count();
        System.out.println(count);
        String allTitles = todos.stream().map(TodoItem::title).collect(Collectors.joining(","));
        System.out.println(allTitles);
    }
}
