package com.example.todobackend.dto;

import com.example.todobackend.entity.Priority;
import com.example.todobackend.entity.Status;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class TodoResponse {
    private Long id;
    private String status;
    private String priority;
    private String description;
    private String title;
    private LocalDate dueDate;
    private String icon;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer sortOrder;
}
