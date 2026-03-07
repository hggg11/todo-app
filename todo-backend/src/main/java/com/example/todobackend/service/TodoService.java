// TodoService.java
package com.example.todobackend.service;

import com.example.todobackend.entity.Todo;
import com.example.todobackend.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;

    public List<Todo> findAll() {
        return todoRepository.findAll();
    }

    public Optional<Todo> findById(Long id) {
        return todoRepository.findById(id);
    }

    public Todo create(Todo todo) {
        return todoRepository.save(todo);
    }

    public Todo update(Long id, Todo updatedTodo) {
        System.out.println("Received Todo: " + updatedTodo.getTitle()); // ここで title が null ならフロントエンドの問題
        return todoRepository.findById(id)
                .map(todo -> {
                    todo.setTitle(updatedTodo.getTitle());
                    todo.setDescription(updatedTodo.getDescription());
                    todo.setCompleted(updatedTodo.isCompleted());
                    return todoRepository.save(todo);
                })
                .orElseThrow(() -> new RuntimeException("Todo not found"));
    }

    public void delete(Long id) {
        todoRepository.deleteById(id);
    }
}