import { configureStore } from "@reduxjs/toolkit";

import analysisReducer from "@/store/slices/analysisSlice";
import authReducer from "@/store/slices/authSlice";
import uiReducer from "@/store/slices/uiSlice";

const ANALYSIS_STATE_KEY = "analysis_state";

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

/** Session-scoped (not localStorage) so an accidental refresh mid-analysis
 * doesn't lose progress, while a closed tab still starts clean next time.
 * The evidence drawer's open flag is intentionally dropped on load — no
 * reason to reopen it mid-slide-in on a rehydrated page. */
const loadAnalysisState = () => {
    if (typeof window === "undefined" || !window.sessionStorage) {
        return undefined;
    }
    try {
        const serializedState = sessionStorage.getItem(ANALYSIS_STATE_KEY);
        if (serializedState === null) {
            return undefined;
        }
        const parsed = JSON.parse(serializedState);
        return { ...parsed, evidenceDrawer: { open: false, evidenceId: null } };
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
        analysis: loadAnalysisState(),
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

    if (typeof window !== "undefined" && window.sessionStorage) {
        try {
            sessionStorage.setItem(ANALYSIS_STATE_KEY, JSON.stringify(state.analysis));
        } catch {
            // Ignore write errors
        }
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
