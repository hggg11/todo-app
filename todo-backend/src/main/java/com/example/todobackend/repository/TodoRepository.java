// TodoRepository.java
package com.example.todobackend.repository;

import com.example.todobackend.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Long> {
}