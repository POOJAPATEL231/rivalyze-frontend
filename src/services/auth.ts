import type { AuthResponse, LoginCredentials, SignupCredentials } from "@/types/auth";

const MOCK_DELAY_MS = 800;

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(MOCK_DELAY_MS);

    return {
        user: { email: credentials.email },
        token: `mock-jwt-${Date.now()}`,
    };
}

export async function signup(credentials: SignupCredentials): Promise<AuthResponse> {
    await delay(MOCK_DELAY_MS);

    return {
        user: { email: credentials.email },
        token: `mock-jwt-${Date.now()}`,
    };
}
