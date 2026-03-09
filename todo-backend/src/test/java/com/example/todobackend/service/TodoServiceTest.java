package com.example.todobackend.service;

import com.example.todobackend.entity.Priority;
import com.example.todobackend.entity.Todo;
import com.example.todobackend.repository.TodoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.*;

@ExtendWith(MockitoExtension.class)  // Mockitoを使う宣言
class TodoServiceTest {

    @Mock
    TodoRepository todoRepository;  // 偽物のリポジトリ

    @InjectMocks
    TodoService todoService;  // 偽物を注入したサービス

    @Test
    void update_タイトルが更新される() {

        // Arrange（準備）：既存のTodoと更新データを用意
        Todo existing = Todo.builder()
                .id(1L)
                .title("古いタイトル")
                .completed(false)
                .priority(Priority.MEDIUM)
                .build();

        Todo updated = Todo.builder()
                .title("新しいタイトル")
                .completed(false)
                .priority(Priority.HIGH)
                .build();

        // リポジトリの偽物の動きを定義
        when(todoRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(todoRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        // Act（実行）：サービスを呼ぶ
        Todo result = todoService.update(1L, updated);

        // Assert（確認）：結果を検証
        assertThat(result.getTitle()).isEqualTo("新しいタイトル");
        assertThat(result.getPriority()).isEqualTo(Priority.HIGH);
    }

}
