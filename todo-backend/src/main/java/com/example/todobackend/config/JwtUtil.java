package com.example.todobackend.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    // 署名に使う秘密鍵（本番では環境変数に入れる）
    private final SecretKey key = Keys.hmacShaKeyFor(
            "my-super-secret-key-that-is-long-enough-32bytes!!".getBytes()
    );

    private final long EXPIRATION_MS = 1000 * 60 * 60; // 1時間

    // トークン生成
    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(key)
                .compact();
    }

    // トークンからユーザー名を取得
    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // トークンの有効性を確認
    public boolean validateToken(String token) {
        try {
            extractUsername(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
