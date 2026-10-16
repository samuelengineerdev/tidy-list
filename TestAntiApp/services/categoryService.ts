import { api } from './api';

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
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/category');
    return response.data.data;
  },

  getById: async (id: number): Promise<Category> => {
    const response = await api.get(`/category/${id}`);
    return response.data.data;
  },

  create: async (data: CreateCategoryData): Promise<Category> => {
    const response = await api.post('/category', data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateCategoryData): Promise<Category> => {
    const response = await api.patch(`/category/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<Category> => {
    const response = await api.delete(`/category/${id}`);
    return response.data.data;
  },
};
