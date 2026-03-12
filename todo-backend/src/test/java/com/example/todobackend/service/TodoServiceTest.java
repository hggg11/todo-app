package com.example.todobackend.service;

import com.example.todobackend.entity.Priority;
import com.example.todobackend.entity.Todo;
import com.example.todobackend.repository.TodoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
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
                //.status()
                .priority(Priority.MEDIUM)
                .build();

        Todo updated = Todo.builder()
                .title("新しいタイトル")
                //.completed(false)
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

    @Test
    void reorder_sortOrderが順番通りに設定される() {
        // Arrange
        Todo todo1 = Todo.builder().id(1L).title("タスク1").priority(Priority.MEDIUM).build();
        Todo todo2 = Todo.builder().id(2L).title("タスク2").priority(Priority.MEDIUM).build();
        Todo todo3 = Todo.builder().id(3L).title("タスク3").priority(Priority.MEDIUM).build();

        when(todoRepository.findById(3L)).thenReturn(Optional.of(todo3));
        when(todoRepository.findById(1L)).thenReturn(Optional.of(todo1));
        when(todoRepository.findById(2L)).thenReturn(Optional.of(todo2));

        // Act
        todoService.reorder(List.of(3L, 1L, 2L));

        // Assert
        assertThat(todo3.getSortOrder()).isEqualTo(0);
        assertThat(todo1.getSortOrder()).isEqualTo(1);
        assertThat(todo2.getSortOrder()).isEqualTo(2);
        verify(todoRepository, times(3)).save(any());
    }

    @Test
    void update_存在しないIDなら例外が発生する() {
        // Arrange
        Todo updated = Todo.builder()
                .title("新しいタイトル")
             //   .completed(false)
                .priority(Priority.HIGH)
                .build();

        // 存在しないIDなのでemptyを返す
        when(todoRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert：例外が投げられることを確認
        assertThatThrownBy(() -> todoService.update(99L, updated))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Todo not found");
    }

}
