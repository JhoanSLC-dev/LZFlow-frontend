<template>
    <div>
        <div class="mb-6">
            <h1 class="heading">{{ isEdit ? 'Edit Product' : 'New Product' }}</h1>
            <p class="subheading mt-1">{{ isEdit ? 'Update product details' : 'Add a product to your catalog' }}</p>
        </div>
        <div class="card max-w-2xl">
            <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
                <FormField name="name" label="Product Name" v-model="form.name" :error="errors.name"
                    placeholder="Product name" />
                <FormField name="description" label="Description" type="textarea" v-model="form.description"
                    :error="errors.description" placeholder="Product description" />
                <div class="grid grid-cols-2 gap-4">
                    <FormField name="categoryId" label="Category" type="select" v-model="form.categoryId"
                        :options="categoryOptions" :error="errors.categoryId" />
                    <FormField name="supplierId" label="Supplier" type="select" v-model="form.supplierId"
                        :options="supplierOptions" :error="errors.supplierId" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <FormField name="costPrice" label="Cost Price" type="number" v-model.number="form.costPrice"
                        :error="errors.costPrice" placeholder="0.00" />
                    <FormField name="salePrice" label="Sale Price" type="number" v-model.number="form.salePrice"
                        :error="errors.salePrice" placeholder="0.00" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <FormField name="stockQuantity" label="Stock Quantity" type="number"
                        v-model.number="form.stockQuantity" :error="errors.stockQuantity" placeholder="0" />
                    <FormField name="minimumStock" label="Minimum Stock" type="number"
                        v-model.number="form.minimumStock" :error="errors.minimumStock" placeholder="0" />
                </div>
                <FormField v-if="isEdit" name="status" label="Status" type="select" v-model="form.status"
                    :options="statusOptions" />
                <div class="flex items-center gap-3 pt-4">
                    <button type="submit" :disabled="submitting" class="btn-primary">
                        <svg v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {{ submitting ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product') }}
                    </button>
                    <router-link to="/products" class="btn-secondary">Cancel</router-link>
                </div>
                <p v-if="apiError" class="text-sm text-red-400 bg-red-500/10 rounded-lg p-3 border border-red-500/20">{{
                    apiError }}</p>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '../../stores/product.store.ts';
import { useCategoryStore } from '../../stores/category.store.ts';
import { useSupplierStore } from '../../stores/supplier.store.ts';
import FormField from '../../components/ui/FormField.vue';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const supplierStore = useSupplierStore();

const isEdit = !!route.params.id;
const submitting = ref(false);
const apiError = ref('');
const form = reactive({ name: '', description: '', categoryId: '', supplierId: '', costPrice: 0, salePrice: 0, stockQuantity: 0, minimumStock: 0, status: 'active' });
const errors = reactive({ name: '', description: '', categoryId: '', supplierId: '', costPrice: '', salePrice: '', stockQuantity: '', minimumStock: '' });

const categoryOptions = computed(() => [{ value: '', label: 'No category' }, ...categoryStore.categories.map((c) => ({ value: c.id, label: c.name }))]);
const supplierOptions = computed(() => [{ value: '', label: 'No supplier' }, ...supplierStore.suppliers.map((s) => ({ value: s.id, label: s.companyName }))]);
const statusOptions = [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'discontinued', label: 'Discontinued' }];

onMounted(async () => {
    await Promise.all([categoryStore.fetchAll(), supplierStore.fetchAll()]);
    if (isEdit) {
        const product = await productStore.fetchById(route.params.id as string);
        if (product) {
            form.name = product.name; form.description = product.description || '';
            form.categoryId = product.categoryId || ''; form.supplierId = product.supplierId || '';
            form.costPrice = Number(product.costPrice); form.salePrice = Number(product.salePrice);
            form.stockQuantity = product.stockQuantity; form.minimumStock = product.minimumStock; form.status = product.status;
        }
    }
});

async function handleSubmit() {
    apiError.value = ''; Object.keys(errors).forEach((k) => (errors[k as keyof typeof errors] = ''));
    let hasError = false;
    if (!form.name) { errors.name = 'Required'; hasError = true; }
    if (!form.costPrice || form.costPrice <= 0) { errors.costPrice = 'Must be positive'; hasError = true; }
    if (!form.salePrice || form.salePrice <= 0) { errors.salePrice = 'Must be positive'; hasError = true; }
    if (hasError) return;
    submitting.value = true;
    try {
        const payload: Record<string, unknown> = { ...form, categoryId: form.categoryId || null, supplierId: form.supplierId || null };
        if (isEdit) { await productStore.update(route.params.id as string, payload); }
        else { await productStore.create(payload); }
        router.push('/products');
    } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string } } };
        apiError.value = error?.response?.data?.error || 'Save failed';
    } finally { submitting.value = false; }
}
</script>
