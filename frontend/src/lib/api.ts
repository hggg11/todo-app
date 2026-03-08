import axios from 'axios';
import type { Todo, TodoCreateInput, TodoUpdateInput } from '../types/todo'; // これを追加
import type { LoginInput } from '../types/auth';
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTodos = async (): Promise<Todo[]> => {
  const res = await api.get('/todos');
  return res.data;
};

export const getTodo = async (id: number): Promise<Todo> => {
  const res = await api.get(`/todos/${id}`);
  return res.data;
};

export const createTodo = async (todo: TodoCreateInput): Promise<Todo> => {
  const res = await api.post('/todos', todo);
  return res.data;
};

export const updateTodo = async (id: number, todo: TodoUpdateInput): Promise<Todo> => {
  const res = await api.put(`/todos/${id}`, todo);
  return res.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await api.delete(`/todos/${id}`);
};

export const login = async (input: LoginInput): Promise<string> => {
  const res = await api.post('/auth/login', input);
  return res.data;
};
