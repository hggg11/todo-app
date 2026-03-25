// TodoService.java
package com.example.todobackend.service;

import com.example.todobackend.dto.TodoRequest;
import com.example.todobackend.dto.TodoResponse;
import com.example.todobackend.entity.Priority;
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
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;
    private TodoResponse toResponse(Todo todo) {
        TodoResponse res = new  TodoResponse();
        res.setId(todo.getId());
        res.setTitle(todo.getTitle());
        res.setPriority(todo.getPriority() != null ? todo.getPriority().name() : null);
        res.setStatus(todo.getStatus() != null ? todo.getStatus().name() : null);
        res.setDescription(todo.getDescription());
        res.setDueDate(todo.getDueDate());
        res.setIcon(todo.getIcon());
        res.setCreatedAt(todo.getCreatedAt());
        res.setUpdatedAt(todo.getUpdatedAt());
        res.setSortOrder(todo.getSortOrder());
        return res;
    }
    private Todo toEntity(TodoRequest request) {
        Todo todo = new Todo();
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setPriority(request.getPriority() != null ? Priority.valueOf(request.getPriority()) : Priority.MEDIUM);
        todo.setStatus(request.getStatus() != null ? Status.valueOf(request.getStatus()) : Status.ACTIVE);
        todo.setIcon(request.getIcon());
        todo.setDueDate(request.getDueDate());
        return todo;
    }
    public List<TodoResponse> findByUserUsername (String username) {
        return todoRepository.findByUserUsername(username).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Optional<TodoResponse> findByIdAndUserUsername(Long id, String username) {
        return todoRepository.findByIdAndUserUsername(id, username).map(todo -> toResponse(todo));
    }

    public TodoResponse create(TodoRequest request, String username) {
        Todo todo = this.toEntity(request);
        if (todo.getStatus() == null) todo.setStatus(Status.ACTIVE);
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException(username));
        todo.setUser(user);
        var list = this.findByUserUsername(username);
        int minSortOrder = list.stream()
                .mapToInt(t -> t.getSortOrder() != null ? t.getSortOrder() : 0)
                .min()
                .orElse(0);
        todo.setSortOrder(--minSortOrder);
        return this.toResponse(todoRepository.save(todo));
    }

    public TodoResponse update(Long id,TodoRequest request, String username) {
        Todo updatedTodo =  this.toEntity(request);
        return this.toResponse(todoRepository.findByIdAndUserUsername(id, username)
                .map(todo -> {
                    todo.setTitle(updatedTodo.getTitle());
                    todo.setDescription(updatedTodo.getDescription());
                    todo.setStatus(updatedTodo.getStatus());
                    todo.setPriority(updatedTodo.getPriority());
                    todo.setDueDate(updatedTodo.getDueDate());
                    todo.setIcon(updatedTodo.getIcon());
                    return todoRepository.save(todo);
                })
                .orElseThrow(() -> new TodoNotFoundException(id, username)));
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

    public List<TodoResponse> searchByTitle(String username, String keyword) {
        return todoRepository.searchByTitle(username, keyword).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<TodoResponse> findByPriority(String username, String priority) {
        return todoRepository.findByUserUsernameAndPriority(username, Priority.valueOf(priority)).stream().map(this::toResponse).collect(Collectors.toList());
    }
}