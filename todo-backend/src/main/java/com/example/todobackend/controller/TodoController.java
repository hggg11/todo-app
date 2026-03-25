// TodoController.java
package com.example.todobackend.controller;

import com.example.todobackend.dto.TodoRequest;
import com.example.todobackend.dto.TodoResponse;
import com.example.todobackend.entity.Todo;
import com.example.todobackend.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.ResponseEntity.status;

@CrossOrigin(origins = "http://localhost:5173")  // viteのデフォルトポート
@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    private String getUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
    @GetMapping
    public List<TodoResponse> getAllTodos() {
        return todoService.findByUserUsername(getUsername());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TodoResponse> getTodoById(@PathVariable Long id) {
        return todoService.findByIdAndUserUsername(id, getUsername())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TodoResponse> createTodo(@Valid @RequestBody TodoRequest request) {
        return ResponseEntity.status(201).body(todoService.create(request, getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TodoResponse> updateTodo(@PathVariable Long id, @RequestBody TodoRequest request) {
        return ResponseEntity.ok(todoService.update(id, request, getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.delete(id, getUsername());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> reorder(@RequestBody List<Long> ids) {
        todoService.reorder(ids, getUsername());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<TodoResponse>> searchByTitle(@RequestParam String keyword) {
        return ResponseEntity.ok(todoService.searchByTitle(getUsername(), keyword));
    }

    @GetMapping("/priority")
    public ResponseEntity<List<TodoResponse>> searchByPriority(@RequestParam String priority) {
        return ResponseEntity.ok(todoService.findByPriority(getUsername(), priority));
    }
}