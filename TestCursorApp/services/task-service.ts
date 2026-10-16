import { ApiSuccessResponse } from '@/types/api';
import { CreateTaskInput, TaskEntity, UpdateTaskInput } from '@/types/task';
import { apiFetch } from './api';

export const taskService = {
  getAll() {
    return apiFetch<ApiSuccessResponse<TaskEntity[]>>('/task', {
      method: 'GET',
      requiresAuth: true,
    });
  },

  getByCategory(categoryId: number) {
    return apiFetch<ApiSuccessResponse<TaskEntity[]>>(`/task/by-category/${categoryId}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  create(body: CreateTaskInput) {
    return apiFetch<ApiSuccessResponse<TaskEntity>>('/task', {
      method: 'POST',
      requiresAuth: true,
      body: JSON.stringify(body),
    });
  },

  update(body: UpdateTaskInput) {
    return apiFetch<ApiSuccessResponse<TaskEntity>>('/task', {
      method: 'PATCH',
      requiresAuth: true,
      body: JSON.stringify(body),
    });
  },

  remove(id: number) {
    return apiFetch<ApiSuccessResponse<TaskEntity>>(`/task/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },
};
