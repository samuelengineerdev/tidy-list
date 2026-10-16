import { useAuthStore } from '@/store/auth-store';
import { ApiErrorResponse } from '@/types/api';

export const API_BASE_URL = 'http://10.0.0.15:8082';

export class ApiError extends Error {
  statusCode: number;
  details?: ApiErrorResponse;

  constructor(message: string, statusCode: number, details?: ApiErrorResponse) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

type RequestOptions = RequestInit & {
  requiresAuth?: boolean;
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { requiresAuth = false, headers, ...rest } = options;
  const token = useAuthStore.getState().token;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(requiresAuth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const payload = (await response.json()) as T | ApiErrorResponse;

  if (!response.ok) {
    const errorPayload = payload as ApiErrorResponse;
    const message = Array.isArray(errorPayload.message)
      ? errorPayload.message.join('\n')
      : errorPayload.message || errorPayload.error || 'Unexpected API error';

    if (response.status === 401) {
      useAuthStore.getState().clearSession();
    }

    throw new ApiError(message, response.status, errorPayload);
  }

  return payload as T;
}
