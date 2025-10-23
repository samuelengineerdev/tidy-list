import { apiRequest } from './api';

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
  async create(data: CreateTaskData): Promise<Task> {
    const response = await apiRequest('/task', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async getAll(): Promise<Task[]> {
    const response = await apiRequest('/task');
    return response.data;
  },

  async getById(id: number): Promise<Task> {
    const response = await apiRequest(`/task/${id}`);
    return response.data;
  },

  async update(data: UpdateTaskData): Promise<Task> {
    const response = await apiRequest('/task', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async delete(id: number): Promise<Task> {
    const response = await apiRequest(`/task/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  },

  async getByCategory(categoryId: number): Promise<Task[]> {
    const response = await apiRequest(`/task/by-category/${categoryId}`);
    return response.data;
  },
};
