import { apiClient } from "@/services/api";
import type {
    ApiLoginRequest,
    ApiSignupRequest,
    ApiTokenResponse,
    ApiRefreshRequest,
} from "@/types/api";

export async function signup(payload: ApiSignupRequest): Promise<ApiTokenResponse> {
    const response = await apiClient.post<ApiTokenResponse>("/api/v1/auth/signup", payload);
    return response.data;
}

export async function login(payload: ApiLoginRequest): Promise<ApiTokenResponse> {
    const response = await apiClient.post<ApiTokenResponse>("/api/v1/auth/login", payload);
    return response.data;
}

export async function logout(refreshToken: string): Promise<void> {
    const payload: ApiRefreshRequest = { refresh_token: refreshToken };
    await apiClient.post("/api/v1/auth/logout", payload);
}
