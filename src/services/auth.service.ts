import api from './api';
import type { AuthResponse } from '../types';

export const authService = {
    async register(data: {
        organizationName: string;
        name: string;
        email: string;
        password: string;
    }): Promise<AuthResponse> {
        const { data: res } = await api.post('/auth/register', data);
        return res.data;
    },

    async login(data: { email: string; password: string }): Promise<AuthResponse> {
        const { data: res } = await api.post('/auth/login', data);
        return res.data;
    },

    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        const { data: res } = await api.post('/auth/refresh', { refreshToken });
        return res.data;
    },

    async forgotPassword(email: string): Promise<void> {
        await api.post('/auth/forgot-password', { email });
    },

    async resetPassword(token: string, password: string): Promise<void> {
        await api.post('/auth/reset-password', { token, password });
    },
};
