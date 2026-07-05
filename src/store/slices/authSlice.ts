import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthTokens, AuthUser } from "@/types/auth";

const SESSION_KEY = "rivalyze_auth_session";

interface PersistedSession {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
}

/** localStorage survives closing the browser; sessionStorage clears with the
 * tab. Which one a session lives in is exactly what "Keep me logged in"
 * controls (see Login.tsx) — checked persists across restarts, unchecked
 * only lasts this tab. */
function loadPersistedSession(): (PersistedSession & { remember: boolean }) | null {
    try {
        const fromLocal = localStorage.getItem(SESSION_KEY);
        if (fromLocal) return { ...(JSON.parse(fromLocal) as PersistedSession), remember: true };
        const fromSession = sessionStorage.getItem(SESSION_KEY);
        if (fromSession)
            return { ...(JSON.parse(fromSession) as PersistedSession), remember: false };
        return null;
    } catch {
        return null;
    }
}

function persistSession(session: PersistedSession, remember: boolean) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearPersistedSession() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
}

interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    /** Which storage this session lives in — needed so a later silent token
     * refresh writes back to the same place instead of always localStorage. */
    remember: boolean;
}

const persisted = loadPersistedSession();

const initialState: AuthState = {
    user: persisted?.user ?? null,
    accessToken: persisted?.accessToken ?? null,
    refreshToken: persisted?.refreshToken ?? null,
    isAuthenticated: !!persisted,
    isLoading: false,
    error: null,
    remember: persisted?.remember ?? true,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess(
            state,
            action: PayloadAction<{ user: AuthUser; remember?: boolean } & AuthTokens>,
        ) {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.remember = action.payload.remember ?? true;
            persistSession(action.payload, state.remember);
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.isLoading = false;
            state.error = action.payload;
        },
        signupStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        signupSuccess(state, action: PayloadAction<{ user: AuthUser } & AuthTokens>) {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            // No "keep me logged in" control on signup — always persist normally.
            state.remember = true;
            persistSession(action.payload, true);
        },
        signupFailure(state, action: PayloadAction<string>) {
            state.isLoading = false;
            state.error = action.payload;
        },
        /** Dispatched by the api client's response interceptor after a
         * silent token refresh — leaves `user` untouched. */
        tokensRefreshed(state, action: PayloadAction<AuthTokens>) {
            if (!state.user) return;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            persistSession({ user: state.user, ...action.payload }, state.remember);
        },
        logout(state) {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.error = null;
            state.remember = true;
            clearPersistedSession();
        },
        clearError(state) {
            state.error = null;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    signupStart,
    signupSuccess,
    signupFailure,
    tokensRefreshed,
    logout,
    clearError,
} = authSlice.actions;
export default authSlice.reducer;
