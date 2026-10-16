import { ApiSuccessResponse, baseApi } from "@/api/base-api";

export type Task = {
    id: number;
    name: string;
    description: string;
    completed: boolean;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
    categoryId: number;
};

export type CreateTaskData = {
    name: string;
    description: string;
    dueDate: string;
    categoryId: number;
};

export type UpdateTaskData = {
    id: number;
    name?: string;
    description?: string;
    dueDate?: string;
    categoryId?: number;
    completed?: boolean;
};

export const taskApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllTasks: builder.query<ApiSuccessResponse<Task[]>, void>({
            query: () => '/task',
            providesTags: ['Task'],
        }),

        getTaskById: builder.query<ApiSuccessResponse<Task>, number>({
            query: (id) => `/task/${id}`,
            providesTags: ['Task'],
        }),

        createTask: builder.mutation<ApiSuccessResponse<Task>, CreateTaskData>({
            query: (data) => ({
                url: '/task',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Task'],
        }),

        updateTask: builder.mutation<ApiSuccessResponse<Task>, UpdateTaskData>({
            query: (data) => ({
                url: '/task',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Task'],
        }),

        deleteTask: builder.mutation<ApiSuccessResponse<Task>, number>({
            query: (id) => ({
                url: `/task/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Task'],
        }),

        getTasksByCategory: builder.query<ApiSuccessResponse<Task[]>, number>({
            query: (categoryId) => `/task/by-category/${categoryId}`,
            providesTags: ['Task'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetAllTasksQuery,
    useGetTaskByIdQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useGetTasksByCategoryQuery,
} = taskApi;

