import { api } from './api';

export interface Task {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  categoryId: number;
}

export interface CreateTaskData {
  name: string;
  description: string;
  dueDate: string;
  categoryId: number;
}

export interface UpdateTaskData {
  id: number;
  name?: string;
  description?: string;
  dueDate?: string;
  categoryId?: number;
  completed?: boolean;
}

export const taskService = {
  getAll: async (): Promise<Task[]> => {
    const response = await api.get('/task');
    return response.data.data;
  },

  getById: async (id: number): Promise<Task> => {
    const response = await api.get(`/task/${id}`);
    return response.data.data;
  },

  create: async (data: CreateTaskData): Promise<Task> => {
    const response = await api.post('/task', data);
    return response.data.data;
  },

  update: async (data: UpdateTaskData): Promise<Task> => {
    const response = await api.patch('/task', data);
    return response.data.data;
  },

  delete: async (id: number): Promise<Task> => {
    const response = await api.delete(`/task/${id}`);
    return response.data.data;
  },
};
