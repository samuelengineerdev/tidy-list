import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/store/slices/authSlice'
import userSettingsReducer from '@/store/slices/user-setting-slice'

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import { baseApi } from '@/api/base-api';

// 1️⃣ Configuración de persistencia para el authSlice
const authPersistConfig = {
    key: 'auth',
    storage: AsyncStorage,
    whitelist: ['user', 'token'], // solo persistimos user y token
};

const userSettingsPersistConfig = {
    key: 'userSettings',
    storage: AsyncStorage,
    whitelist: ['darkMode']
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUserSettingsReducer = persistReducer(userSettingsPersistConfig, userSettingsReducer);


export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        auth: persistedAuthReducer,
        userSettings: persistedUserSettingsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(baseApi.middleware),
})

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch