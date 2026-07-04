import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { store } from "@/store";
import { logout, tokensRefreshed } from "@/store/slices/authSlice";
import type { ApiTokenResponse } from "@/types/api";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

const AUTH_ENDPOINTS = ["/api/v1/auth/login", "/api/v1/auth/signup", "/api/v1/auth/refresh"];

apiClient.interceptors.request.use((config) => {
    const { accessToken } = store.getState().auth;
    if (accessToken) {
        config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return config;
});

interface RetriableConfig extends InternalAxiosRequestConfig {
    _retried?: boolean;
}

/** Shared across concurrent 401s so a burst of requests triggers one
 * refresh call, not one per request (the backend may rotate the refresh
 * token on use, which would invalidate a second concurrent attempt). */
let refreshPromise: Promise<ApiTokenResponse> | null = null;

function refreshTokens(refreshToken: string): Promise<ApiTokenResponse> {
    // Bare axios call — bypasses apiClient's interceptors to avoid recursion.
    return axios
        .post<ApiTokenResponse>(
            "/api/v1/auth/refresh",
            { refresh_token: refreshToken },
            { baseURL: import.meta.env.VITE_API_BASE_URL },
        )
        .then((res) => res.data);
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const config = error.config as RetriableConfig | undefined;
        const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => config?.url?.includes(path));

        if (error.response?.status !== 401 || !config || config._retried || isAuthEndpoint) {
            return Promise.reject(error);
        }

        const { refreshToken } = store.getState().auth;
        if (!refreshToken) {
            store.dispatch(logout());
            return Promise.reject(error);
        }

        config._retried = true;
        try {
            refreshPromise ??= refreshTokens(refreshToken).finally(() => {
                refreshPromise = null;
            });
            const tokens = await refreshPromise;
            store.dispatch(
                tokensRefreshed({
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                }),
            );
            config.headers.set("Authorization", `Bearer ${tokens.access_token}`);
            return apiClient(config);
        } catch (refreshError) {
            store.dispatch(logout());
            return Promise.reject(refreshError);
        }
    },
);
