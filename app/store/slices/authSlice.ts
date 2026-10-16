import { User } from '@/api/auth-api';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export type AuthState = {
    user: User | null,
    token: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null
}

export const authSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        logOut: (state) => {
            state.user = null;
            state.token = null;
        },

        logIn: (state, action: PayloadAction<AuthState>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        }
    },
})

// Action creators are generated for each case reducer function
export const { logIn, logOut } = authSlice.actions

export default authSlice.reducer