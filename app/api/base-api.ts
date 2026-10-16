// api/baseApi.ts
import { RootState } from '@/store/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type ApiSuccessResponse<T> = {
  statusCode: number;
  message: string;
  data: T;
}

export type ApiErrorResponse = {
  data: {
    statusCode: number;
    message: string | string[],
  }
}

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://10.0.255.16:8082',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// 🔹 Configura la API base
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery,
  tagTypes: [
    'Auth',
    'UserSettings',
    'Task',
    'Category'
  ],
  endpoints: () => ({}), // 🔸 sin endpoints aquí, se inyectan después
});
