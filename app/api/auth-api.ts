import { ApiSuccessResponse, baseApi } from "@/api/base-api";

export type User = {
    id: number;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export type LoginUser = {
    email: string;
    password: string;
}

export type LoginResponse = {
    user: User;
    token: string;
};

export type RegisterUser = {
    email: string;
    password: string;
    confirmPassword: string;
};

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<ApiSuccessResponse<LoginResponse>, LoginUser>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),

        register: builder.mutation<ApiSuccessResponse<User>, RegisterUser>({
            query: (data) => ({
                url: '/auth/register',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Auth'],
        }),
        
        getProfile: builder.query<User, void>({
            query: () => '/auth/profile',
            providesTags: ['Auth'],
        }),
    }),
    overrideExisting: false,
});

export const { useLoginMutation, useRegisterMutation, useGetProfileQuery } = authApi;
