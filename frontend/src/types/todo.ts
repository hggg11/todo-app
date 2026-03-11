export type Status = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Todo {
  id: number;
  title: string;
  description?: string;
  status: Status;
  dueDate?: string;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  sortOrder?: number;
  icon?: string;
}

export type TodoCreateInput = Pick<Todo, "title" | "description" | "dueDate" | "priority" | "icon" | "status">;
export type TodoUpdateInput = {
    title: string;
    description?: string;
    status: Status;
    dueDate?: string;
    priority: Priority;
    icon?: string;
};
