import api from './api';
import type { Sale, PaginatedResponse } from '../types';

export const saleService = {
    async findAll(params?: Record<string, unknown>): Promise<PaginatedResponse<Sale>> {
        const { data } = await api.get('/sales', { params });
        return data;
    },

    async findById(id: string): Promise<Sale> {
        const { data } = await api.get(`/sales/${id}`);
        return data.data;
    },

    async create(dto: {
        customerName: string;
        tax?: number;
        items: { productId: string; quantity: number; unitPrice: number }[];
    }): Promise<Sale> {
        const { data } = await api.post('/sales', dto);
        return data.data;
    },
};
