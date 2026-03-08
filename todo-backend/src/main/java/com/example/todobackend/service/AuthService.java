package com.example.todobackend.service;

import com.example.todobackend.config.JwtUtil;
import com.example.todobackend.entity.User;
import com.example.todobackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public String login(String username, String password) {
        // ① usernameでユーザーを検索
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));

        // ② パスワードを検証
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("パスワードが違います");
        }

        // ③ JWTトークンを生成して返す
        return jwtUtil.generateToken(username);
    }
}
