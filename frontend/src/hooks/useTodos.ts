import { useState, useEffect } from "react";
import type { Priority, Status, Todo, TodoCreateInput } from "../types/todo";
import { type DropResult } from '@hello-pangea/dnd';
import { getTodos, createTodo, updateTodo, deleteTodo, reorderTodos } from '../lib/api';
export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(false);
    const [secondsAgo, setsecondsAgo] = useState(0);
    const [lastFetched, setLastFetched] = useState<Date | null>(null);
    const handleEdit = async (id: number, updates: Omit<TodoCreateInput, 'status'> & {status: Status}) => {
        try {
            const updated = await updateTodo(id, updates);
            setTodos(prev => prev.map(t => t.id === id ? updated : t));
            return true;
        } catch (err) {
            alert('更新に失敗しました');
            return false;
        }
    }
    const fetchTodos = async () => {
        try {
          setLoading(true);
          const data = await getTodos();
          setTodos(data);
          setLastFetched(new Date());
        } catch (err) {
          console.error('Failed to fetch todos', err);
        } finally {
          setLoading(false);
        }
      };
    const handleDragEnd = async (result: DropResult, activeTodos: Todo[]) => {
        if (!result.destination) return;
        if (result.source.index === result.destination.index) return;
        const items = Array.from(activeTodos);
        const [moved] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, moved);
        setTodos(prev => {
            const sortItems = items.map((todo, index) => ({
                ...todo,
                sortOrder: index  // indexを使って新しい値を入れる
            }))
            // TODO　見直しが必要かも
            const nonActiveItems = prev.filter(t => t.status !== 'ACTIVE');
            return [...sortItems, ...nonActiveItems];
        });
        try {
            await reorderTodos(items.map(t => t.id));
        } catch {
            fetchTodos();
        }
    };
  const handleAdd = async (input: TodoCreateInput) => {
    try {
      const newTodo = await createTodo(input);
      setTodos(prev => [newTodo, ...prev]);
    } catch (err) {
      alert('追加に失敗しました');
    }
  };
  const handleStatusChange = async (id: number, newStatus: Status) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;
      const updated = await updateTodo(id, { ...todo, status: newStatus });
      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch (err) {
      alert('更新に失敗しました');
    }
  };
  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか？')) return;
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert('削除に失敗しました');
    }
  };
  useEffect(() => {
    if (!lastFetched) return;
    setsecondsAgo(0);
    const timer = setInterval(() => {
      setsecondsAgo(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  },[lastFetched])
  return {todos, loading, secondsAgo, lastFetched, fetchTodos, handleDragEnd, handleAdd, handleStatusChange, handleDelete, handleEdit}
}
