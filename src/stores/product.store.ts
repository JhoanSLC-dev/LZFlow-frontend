import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Product } from '../types';
import { productService } from '../services/product.service';

export const useProductStore = defineStore('product', () => {
    const products = ref<Product[]>([]);
    const currentProduct = ref<Product | null>(null);
    const loading = ref(false);
    const total = ref(0);

    async function fetchAll(params?: Record<string, unknown>) {
        loading.value = true;
        try {
            const response = await productService.findAll(params);
            products.value = response.data;
            total.value = response.meta.total;
            return response;
        } finally {
            loading.value = false;
        }
    }

    async function fetchById(id: string) {
        loading.value = true;
        try {
            currentProduct.value = await productService.findById(id);
            return currentProduct.value;
        } finally {
            loading.value = false;
        }
    }

    async function create(dto: Record<string, unknown>) {
        const product = await productService.create(dto);
        products.value.unshift(product);
        return product;
    }

    async function update(id: string, dto: Record<string, unknown>) {
        const product = await productService.update(id, dto);
        const index = products.value.findIndex((p) => p.id === id);
        if (index !== -1) products.value[index] = product;
        return product;
    }

    async function remove(id: string) {
        await productService.remove(id);
        products.value = products.value.filter((p) => p.id !== id);
    }

    return {
        products,
        currentProduct,
        loading,
        total,
        fetchAll,
        fetchById,
        create,
        update,
        remove,
    };
});
