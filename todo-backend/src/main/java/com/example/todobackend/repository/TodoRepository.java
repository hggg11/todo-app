// TodoRepository.java
package com.example.todobackend.repository;

import com.example.todobackend.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUserUsername (String username);
    Optional<Todo> findByIdAndUserUsername(Long id, String username  );
}