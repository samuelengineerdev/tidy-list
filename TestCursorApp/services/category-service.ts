import { ApiSuccessResponse } from '@/types/api';
import { CategoryEntity } from '@/types/category';
import { apiFetch } from './api';

export const categoryService = {
  getAll() {
    return apiFetch<ApiSuccessResponse<CategoryEntity[]>>('/category', {
      method: 'GET',
      requiresAuth: true,
    });
  },
};
