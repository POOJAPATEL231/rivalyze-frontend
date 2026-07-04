import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthTokens, AuthUser } from "@/types/auth";

const SESSION_KEY = "rivalyze_auth_session";

interface PersistedSession {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
}

function loadPersistedSession(): PersistedSession | null {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? (JSON.parse(raw) as PersistedSession) : null;
    } catch {
        return null;
    }
}

function persistSession(session: PersistedSession) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const persisted = loadPersistedSession();

const initialState: AuthState = {
    user: persisted?.user ?? null,
    accessToken: persisted?.accessToken ?? null,
    refreshToken: persisted?.refreshToken ?? null,
    isAuthenticated: !!persisted,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess(state, action: PayloadAction<{ user: AuthUser } & AuthTokens>) {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            persistSession(action.payload);
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
            persistSession(action.payload);
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
            persistSession({ user: state.user, ...action.payload });
        },
        logout(state) {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem(SESSION_KEY);
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
