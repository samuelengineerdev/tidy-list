import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Create a configured axios instance
export const api = axios.create({
  baseURL: 'https://www.api.tidylist.samuelengineer.dev',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the bearer token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Optional response interceptor to handle token expiry (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and force logout if unauthorized
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
