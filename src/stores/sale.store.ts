import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Sale } from '../types';
import { saleService } from '../services/sale.service';

export const useSaleStore = defineStore('sale', () => {
    const sales = ref<Sale[]>([]);
    const currentSale = ref<Sale | null>(null);
    const loading = ref(false);
    const total = ref(0);

    async function fetchAll(params?: Record<string, unknown>) {
        loading.value = true;
        try {
            const response = await saleService.findAll(params);
            sales.value = response.data;
            total.value = response.meta.total;
            return response;
        } finally {
            loading.value = false;
        }
    }

    async function fetchById(id: string) {
        loading.value = true;
        try {
            currentSale.value = await saleService.findById(id);
            return currentSale.value;
        } finally {
            loading.value = false;
        }
    }

    async function create(dto: {
        customerName: string;
        tax?: number;
        items: { productId: string; quantity: number; unitPrice: number }[];
    }) {
        const sale = await saleService.create(dto);
        sales.value.unshift(sale);
        return sale;
    }

    return { sales, currentSale, loading, total, fetchAll, fetchById, create };
});
