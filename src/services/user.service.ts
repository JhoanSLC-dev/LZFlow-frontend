import api from './api';
import type { User } from '../types';

export const userService = {
    async findAll(): Promise<User[]> {
        const { data } = await api.get('/users');
        return data.data;
    },

    async findById(id: string): Promise<User> {
        const { data } = await api.get(`/users/${id}`);
        return data.data;
    },

    async create(dto: {
        name: string;
        email: string;
        password: string;
        role: string;
    }): Promise<User> {
        const { data } = await api.post('/users', dto);
        return data.data;
    },

    async update(id: string, dto: Partial<User>): Promise<User> {
        const { data } = await api.put(`/users/${id}`, dto);
        return data.data;
    },

    async remove(id: string): Promise<void> {
        await api.delete(`/users/${id}`);
    },
};
