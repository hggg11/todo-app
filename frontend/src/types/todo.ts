export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  sortOrder?: number;
}

export type TodoCreateInput = Pick<Todo, "title" | "description" | "dueDate" | "priority">;
export type TodoUpdateInput = {
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: string;
    priority: Priority;
};
