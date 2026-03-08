package com.example.todobackend.config;

import com.example.todobackend.entity.User;
import com.example.todobackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // すでにユーザーがいなければ作成
        if (userRepository.count() == 0) {
            User user = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("password123"))
                    .build();
            userRepository.save(user);
            System.out.println("テストユーザーを作成しました: admin / password123");
        }
    }
}
