import { ApiSuccessResponse, baseApi } from "@/api/base-api";

export type UserSettings = {
    id: number;
    darkMode: boolean;
    userId: number;
}

export type CreateOrUpdate = {
    darkMode: boolean;
}

export const userSettingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createOrUpdate: builder.mutation<ApiSuccessResponse<UserSettings>, CreateOrUpdate>({
            query: (body) => ({
                url: '/user/user-settings',
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['UserSettings'],
        }),
        
        getUserSettings: builder.query<ApiSuccessResponse<UserSettings>, void>({
            query: () => '/user/user-settings',
            providesTags: ['UserSettings'],
        }),
    }),
    overrideExisting: false,
});

export const { useCreateOrUpdateMutation, useLazyGetUserSettingsQuery } = userSettingsApi;
