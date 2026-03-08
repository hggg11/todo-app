package com.example.todobackend.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "users")  // "user" はSQLの予約語なので "users" にする
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;
}
