// TodoController.java
package com.example.todobackend.controller;

import com.example.todobackend.entity.Todo;
import com.example.todobackend.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public List<Todo> getAllTodos() {
        return todoService.findByUserUsername(getUsername());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
        return todoService.findByIdAndUserUsername(id, getUsername())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Todo createTodo(@RequestBody Todo todo) {
        return todoService.create(todo, getUsername());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todo) {
        return ResponseEntity.ok(todoService.update(id, todo, getUsername()));
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
}