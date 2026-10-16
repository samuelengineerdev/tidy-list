import { ApiSuccessResponse, baseApi } from "@/api/base-api";

export type Category = {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
};

export type CreateCategoryData = {
    name: string;
};

export type UpdateCategoryData = {
    name: string;
};

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategories: builder.query<ApiSuccessResponse<Category[]>, void>({
            query: () => '/category',
            providesTags: ['Category'],
        }),

        getCategoryById: builder.query<ApiSuccessResponse<Category>, number>({
            query: (id) => `/category/${id}`,
            providesTags: ['Category'],
        }),

        createCategory: builder.mutation<ApiSuccessResponse<Category>, CreateCategoryData>({
            query: (data) => ({
                url: '/category',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),

        updateCategory: builder.mutation<ApiSuccessResponse<Category>, { id: number; data: UpdateCategoryData }>({
            query: ({ id, data }) => ({
                url: `/category/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),

        deleteCategory: builder.mutation<ApiSuccessResponse<Category>, number>({
            query: (id) => ({
                url: `/category/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;

