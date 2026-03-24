package com.example.todobackend.dto;

import com.example.todobackend.entity.Priority;
import com.example.todobackend.entity.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TodoRequest {
    @NotBlank(message = "タイトルは必須です")
    private String title;
    private String description;
    private String status;
    @Pattern(regexp = "HIGH|MEDIUM|LOW", message = "優先度は高/中/低のいずれかです")
    private String priority;
    private LocalDate dueDate;
    private String icon;
}
