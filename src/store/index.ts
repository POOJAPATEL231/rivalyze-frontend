import { configureStore } from "@reduxjs/toolkit";

import analysisReducer from "@/store/slices/analysisSlice";
import authReducer from "@/store/slices/authSlice";
import uiReducer from "@/store/slices/uiSlice";

const loadUiState = () => {
    if (typeof window === "undefined" || !window.localStorage) {
        return undefined;
    }
    try {
        const serializedState = localStorage.getItem("ui_state");
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch {
        return undefined;
    }
};

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        analysis: analysisReducer,
        auth: authReducer,
    },
    preloadedState: {
        ui: loadUiState(),
    },
});

store.subscribe(() => {
    const state = store.getState();

    if (typeof window !== "undefined" && window.localStorage) {
        try {
            localStorage.setItem("ui_state", JSON.stringify(state.ui));
        } catch {
            // Ignore write errors
        }
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
