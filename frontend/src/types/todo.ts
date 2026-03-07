export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TodoCreateInput = Pick<Todo, "title" | "description">;
export type TodoUpdateInput = {
    title: string;
    description?: string;
    completed: boolean;
};
