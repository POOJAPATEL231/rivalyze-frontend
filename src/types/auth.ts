export interface AuthUser {
    email: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: AuthUser;
    token: string;
}
