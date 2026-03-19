// TodoService.java
package com.example.todobackend.service;

import com.example.todobackend.entity.Status;
import com.example.todobackend.entity.Todo;
import com.example.todobackend.entity.User;
import com.example.todobackend.exception.TodoNotFoundException;
import com.example.todobackend.exception.UserNotFoundException;
import com.example.todobackend.repository.TodoRepository;
import com.example.todobackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;
    public List<Todo> findByUserUsername (String username) {
        return todoRepository.findByUserUsername(username);
    }

    public Optional<Todo> findByIdAndUserUsername(Long id, String username) {
        return todoRepository.findByIdAndUserUsername(id, username);
    }

    public Todo create(Todo todo, String username) {
        if (todo.getStatus() == null) todo.setStatus(Status.ACTIVE);
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException(username));
        todo.setUser(user);
        var list = this.findByUserUsername(username);
        int minSortOrder = list.stream()
                .mapToInt(t -> t.getSortOrder() != null ? t.getSortOrder() : 0)
                .min()
                .orElse(0);
        todo.setSortOrder(--minSortOrder);
        return todoRepository.save(todo);
    }

    public Todo update(Long id, Todo updatedTodo, String username) {
        return todoRepository.findByIdAndUserUsername(id, username)
                .map(todo -> {
                    todo.setTitle(updatedTodo.getTitle());
                    todo.setDescription(updatedTodo.getDescription());
                    todo.setStatus(updatedTodo.getStatus());
                    todo.setPriority(updatedTodo.getPriority());
                    todo.setDueDate(updatedTodo.getDueDate());
                    todo.setIcon(updatedTodo.getIcon());
                    return todoRepository.save(todo);
                })
                .orElseThrow(() -> new TodoNotFoundException(id, username));
    }

    public void delete(Long id, String username) {
        Todo todo = todoRepository.findByIdAndUserUsername(id, username).orElseThrow(() -> new TodoNotFoundException(id,username));
        todoRepository.delete(todo);
    }

    public void reorder(List<Long> ids, String username) {
        for (int i = 0; i < ids.size(); i++) {
            Long id = ids.get(i);
            Todo todo = todoRepository.findByIdAndUserUsername(id, username).orElseThrow(() -> new TodoNotFoundException(id, username));
            todo.setSortOrder(i);
            todoRepository.save(todo);
        }
    }

}