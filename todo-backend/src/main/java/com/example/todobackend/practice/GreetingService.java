package com.example.todobackend.practice;

import org.springframework.stereotype.Service;

@Service
public class GreetingService {
    String greeting(String username){
        return String.format("こんにちは、%sさん！",username);
    }
}
