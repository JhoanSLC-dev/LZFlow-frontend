import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Category } from '../types';
import { categoryService } from '../services/category.service';

export const useCategoryStore = defineStore('category', () => {
    const categories = ref<Category[]>([]);
    const loading = ref(false);

    async function fetchAll() {
        loading.value = true;
        try {
            categories.value = await categoryService.findAll();
        } finally {
            loading.value = false;
        }
    }

    async function create(dto: Partial<Category>) {
        const category = await categoryService.create(dto);
        categories.value.push(category);
        return category;
    }

    async function update(id: string, dto: Partial<Category>) {
        const category = await categoryService.update(id, dto);
        const index = categories.value.findIndex((c) => c.id === id);
        if (index !== -1) categories.value[index] = category;
        return category;
    }

    async function remove(id: string) {
        await categoryService.remove(id);
        categories.value = categories.value.filter((c) => c.id !== id);
    }

    return { categories, loading, fetchAll, create, update, remove };
});
