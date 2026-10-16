export type TaskEntity = {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  categoryId: number;
};

export type CreateTaskInput = {
  name: string;
  description?: string;
  dueDate?: string;
  categoryId: number;
};

export type UpdateTaskInput = {
  id: number;
  name?: string;
  description?: string;
  dueDate?: string;
  categoryId?: number;
  completed?: boolean;
};
