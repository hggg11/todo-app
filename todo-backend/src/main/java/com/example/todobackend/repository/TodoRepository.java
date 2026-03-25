// TodoRepository.java
package com.example.todobackend.repository;

import com.example.todobackend.entity.Priority;
import com.example.todobackend.entity.Status;
import com.example.todobackend.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUserUsername (String username);
    Optional<Todo> findByIdAndUserUsername(Long id, String username  );
    List<Todo> findByUserUsernameAndPriority(String username, Priority priority);
    List<Todo> findByUserUsernameAndDueDateBefore(String username, LocalDate dueDate);
    List<Todo> findByUserUsernameAndStatusOrderByCreatedAtDesc(String username, Status status);

    @Query("SELECT t FROM Todo t WHERE t.user.username = :username AND t.title LIKE CONCAT('%', :keyword, '%')")
    List<Todo> searchByTitle(@Param("username") String username, @Param("keyword") String keyword);
}