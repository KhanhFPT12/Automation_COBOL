import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

export type Theme = 'default' | 'mainframe-green' | 'mainframe-yellow';

export type ThemeType = {
  name: Theme;
};

const initialState: ThemeType = {
  name: 'default',
};

const themesSlice = createSlice({
  name: 'theme',
  initialState: initialState,
  reducers: {
    changeTheme(state, action: PayloadAction<Theme>) {
      state.name = action.payload;
    },
  },
});

export const { changeTheme } = themesSlice.actions;

export default themesSlice.reducer;
