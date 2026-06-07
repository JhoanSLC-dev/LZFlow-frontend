export interface User {
    id: string;
    email: string;
    name: string;
    role: 'owner' | 'manager' | 'employee';
    organizationId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ApiError {
    success: false;
    error: string;
    details?: Record<string, string[]>;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}
