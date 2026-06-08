import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Supplier } from '../types';
import { supplierService } from '../services/supplier.service';

export const useSupplierStore = defineStore('supplier', () => {
    const suppliers = ref<Supplier[]>([]);
    const loading = ref(false);

    async function fetchAll() {
        loading.value = true;
        try {
            suppliers.value = await supplierService.findAll();
        } finally {
            loading.value = false;
        }
    }

    async function create(dto: Partial<Supplier>) {
        const supplier = await supplierService.create(dto);
        suppliers.value.push(supplier);
        return supplier;
    }

    async function update(id: string, dto: Partial<Supplier>) {
        const supplier = await supplierService.update(id, dto);
        const index = suppliers.value.findIndex((s) => s.id === id);
        if (index !== -1) suppliers.value[index] = supplier;
        return supplier;
    }

    async function remove(id: string) {
        await supplierService.remove(id);
        suppliers.value = suppliers.value.filter((s) => s.id !== id);
    }

    return { suppliers, loading, fetchAll, create, update, remove };
});
