import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type UserSettingSlice = {
    darkMode: boolean;
}

const initialState: UserSettingSlice = {
    darkMode: false
}

export const userSettingSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Pick<UserSettingSlice, 'darkMode'>>) => {
            state.darkMode = action.payload.darkMode;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setTheme } = userSettingSlice.actions


export default userSettingSlice.reducer