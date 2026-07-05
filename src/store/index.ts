import { configureStore, type Reducer } from "@reduxjs/toolkit";

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

const LOGOUT_ACTION = "auth/logout";

/** Wrap any slice reducer so that dispatching auth/logout resets it to its
 * initial state. Generic over the slice's state type so TypeScript infers
 * correctly without losing the original return type. */
function withLogoutReset<S>(reducer: Reducer<S>): Reducer<S> {
    return (state, action) => {
        if (action.type === LOGOUT_ACTION) {
            // Passing `undefined` makes RTK re-run the reducer with no state,
            // which returns each slice's own initialState.
            return reducer(undefined, action);
        }
        return reducer(state, action);
    };
}

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        analysis: withLogoutReset(analysisReducer),
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

/** Called once by the logout action to wipe all browser-persisted data that
 * doesn't belong to a new anonymous session. ui_state is intentionally kept
 * so the user's theme preference survives a logout → re-login cycle. */
export function clearAllPersistedData() {
    try {
        localStorage.removeItem("ui_state");
        sessionStorage.clear();
    } catch {
        // Ignore
    }
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
