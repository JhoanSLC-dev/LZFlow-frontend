import api from './api';
import type { Supplier } from '../types';

export const supplierService = {
    async findAll(): Promise<Supplier[]> {
        const { data } = await api.get('/suppliers');
        return data.data;
    },

    async findById(id: string): Promise<Supplier> {
        const { data } = await api.get(`/suppliers/${id}`);
        return data.data;
    },

    async create(dto: Partial<Supplier>): Promise<Supplier> {
        const { data } = await api.post('/suppliers', dto);
        return data.data;
    },

    async update(id: string, dto: Partial<Supplier>): Promise<Supplier> {
        const { data } = await api.put(`/suppliers/${id}`, dto);
        return data.data;
    },

    async remove(id: string): Promise<void> {
        await api.delete(`/suppliers/${id}`);
    },
};
