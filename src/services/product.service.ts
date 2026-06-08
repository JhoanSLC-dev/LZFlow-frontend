import api from './api';
import type { Product, PaginatedResponse } from '../types';

export const productService = {
    async findAll(params?: Record<string, unknown>): Promise<PaginatedResponse<Product>> {
        const { data } = await api.get('/products', { params });
        return data;
    },

    async findById(id: string): Promise<Product> {
        const { data } = await api.get(`/products/${id}`);
        return data.data;
    },

    async create(dto: Record<string, unknown>): Promise<Product> {
        const { data } = await api.post('/products', dto);
        return data.data;
    },

    async update(id: string, dto: Record<string, unknown>): Promise<Product> {
        const { data } = await api.put(`/products/${id}`, dto);
        return data.data;
    },

    async remove(id: string): Promise<void> {
        await api.delete(`/products/${id}`);
    },
};
