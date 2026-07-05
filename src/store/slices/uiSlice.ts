import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Theme = "dark" | "light";

interface UiState {
    sidebarOpen: boolean;
    theme: Theme;
}

const initialState: UiState = {
    sidebarOpen: true,
    theme: "light",
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleSidebar(state) {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen(state, action: PayloadAction<boolean>) {
            state.sidebarOpen = action.payload;
        },
        toggleTheme(state) {
            state.theme = state.theme === "dark" ? "light" : "dark";
        },
        setTheme(state, action: PayloadAction<Theme>) {
            state.theme = action.payload;
        },
    },
});

export const { toggleSidebar, setSidebarOpen, toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
