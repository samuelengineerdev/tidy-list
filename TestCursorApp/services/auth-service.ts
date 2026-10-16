import { useAuthStore } from '@/store/auth-store';
import { ApiSuccessResponse } from '@/types/api';
import { apiFetch } from './api';

type LoginBody = {
  email: string;
  password: string;
};

type RegisterBody = {
  email: string;
  password: string;
  confirmPassword: string;
};

type LoginResponse = {
  user: {
    id: number;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
};

export const authService = {
  async login(body: LoginBody) {
    return apiFetch<ApiSuccessResponse<LoginResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async register(body: RegisterBody) {
    return apiFetch<
      ApiSuccessResponse<{
        id: number;
        email: string;
        createdAt: string;
        updatedAt: string;
      }>
    >('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async getProfile() {
    return apiFetch<
      ApiSuccessResponse<{
        id: number;
        email: string;
        createdAt: string;
        updatedAt: string;
        iat: number;
      }>
    >('/auth/profile', {
      method: 'GET',
      requiresAuth: true,
    });
  },

  logout() {
    useAuthStore.getState().clearSession();
  },
};
