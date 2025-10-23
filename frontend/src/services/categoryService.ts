import { apiRequest } from './api';

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface CreateCategoryData {
  name: string;
}

export interface UpdateCategoryData {
  name: string;
}

export const categoryService = {
  async create(data: CreateCategoryData): Promise<Category> {
    const response = await apiRequest('/category', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async getAll(): Promise<Category[]> {
    const response = await apiRequest('/category');
    return response.data;
  },

  async getById(id: number): Promise<Category> {
    const response = await apiRequest(`/category/${id}`);
    return response.data;
  },

  async update(id: number, data: UpdateCategoryData): Promise<Category> {
    const response = await apiRequest(`/category/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async delete(id: number): Promise<Category> {
    const response = await apiRequest(`/category/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  },
};
