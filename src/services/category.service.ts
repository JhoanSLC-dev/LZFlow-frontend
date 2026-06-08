import api from './api';
import type { Category } from '../types';

export const categoryService = {
    async findAll(): Promise<Category[]> {
        const { data } = await api.get('/categories');
        return data.data;
    },

    async findById(id: string): Promise<Category> {
        const { data } = await api.get(`/categories/${id}`);
        return data.data;
    },

    async create(dto: Partial<Category>): Promise<Category> {
        const { data } = await api.post('/categories', dto);
        return data.data;
    },

    async update(id: string, dto: Partial<Category>): Promise<Category> {
        const { data } = await api.put(`/categories/${id}`, dto);
        return data.data;
    },

    async remove(id: string): Promise<void> {
        await api.delete(`/categories/${id}`);
    },
};
