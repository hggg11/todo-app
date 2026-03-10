// TodoService.java
package com.example.todobackend.service;

import com.example.todobackend.entity.Todo;
import com.example.todobackend.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
        return todoRepository.findById(id)
                .map(todo -> {
                    todo.setTitle(updatedTodo.getTitle());
                    todo.setDescription(updatedTodo.getDescription());
                    todo.setStatus(updatedTodo.getStatus());
                    todo.setPriority(updatedTodo.getPriority());
                    todo.setDueDate(updatedTodo.getDueDate());
                    todo.setIcon(updatedTodo.getIcon());
                    return todoRepository.save(todo);
                })
                .orElseThrow(() -> new RuntimeException("Todo not found"));
    }

    public void delete(Long id) {
        todoRepository.deleteById(id);
    }

    public void reorder(List<Long> ids) {
        for (int i = 0; i < ids.size(); i++) {
            Todo todo = todoRepository.findById(ids.get(i)).orElseThrow();
            todo.setSortOrder(i);
            todoRepository.save(todo);
        }
    }

}