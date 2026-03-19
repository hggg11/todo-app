package com.example.todobackend.practice;

import java.util.List;
import java.util.Optional;

public class Utils {
    public static  <T extends Comparable<T>> Optional<T> findMax(List<T> list) {
        if (list == null || list.isEmpty()) {return Optional.empty();}
        T max = list.get(0);
        for (T item : list) {
            if (item.compareTo(max) > 0) {
                max = item;
            }
        }
        return Optional.of(max);
    }
}
