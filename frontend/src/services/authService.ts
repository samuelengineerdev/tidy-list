import { apiRequest, setAuthToken, removeAuthToken } from './api';

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  async register(data: RegisterData) {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async login(data: LoginData): Promise<LoginResponse> {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await apiRequest('/auth/profile');
    return response.data;
  },

  logout() {
    removeAuthToken();
  },
};
