<template>
    <div>
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="heading">Products</h1>
                <p class="subheading mt-1">{{ total }} products in your catalog</p>
            </div>
            <router-link to="/products/new" class="btn-primary">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                New Product
            </router-link>
        </div>

        <div class="card p-4 mb-6">
            <div class="flex flex-wrap gap-3">
                <div class="relative flex-1 min-w-[200px]">
                    <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input v-model="filters.search" placeholder="Search products..." class="input pl-10"
                        @input="debouncedSearch" />
                </div>
                <select v-model="filters.categoryId" class="input w-44" @change="fetchProducts">
                    <option value="">All Categories</option>
                    <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
                <select v-model="filters.status" class="input w-36" @change="fetchProducts">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="discontinued">Discontinued</option>
                </select>
            </div>
        </div>

        <DataTable :columns="columns" :data="products as unknown as Record<string, unknown>[]" :loading="loading">
            <template #cell-name="{ row }">
                <div class="flex items-center gap-3">
                    <div
                        class="w-9 h-9 rounded-xl bg-gradient-to-br from-lz-500/20 to-lz-700/20 flex items-center justify-center border border-dark-600">
                        <span class="text-xs">📦</span>
                    </div>
                    <div>
                        <p class="font-medium text-dark-200">{{ row.name }}</p>
                        <p class="text-xs text-dark-500">{{ row.sku }}</p>
                    </div>
                </div>
            </template>
            <template #cell-salePrice="{ row }">
                <span class="text-dark-200 font-medium">${{ Number(row.salePrice).toLocaleString() }}</span>
            </template>
            <template #cell-stockQuantity="{ row }">
                <span
                    :class="(row.stockQuantity as number) <= (row.minimumStock as number) ? 'text-red-400 font-medium' : 'text-dark-300'">
                    {{ row.stockQuantity }}
                </span>
            </template>
            <template #cell-status="{ row }">
                <span :class="statusClass(row.status as string)">{{ row.status }}</span>
            </template>
            <template #cell-createdAt="{ row }">
                <span class="text-dark-400">{{ formatDate(row.createdAt as string) }}</span>
            </template>
            <template #actions="{ row }">
                <router-link :to="`/products/${row.id}/edit`"
                    class="text-lz-400 hover:text-lz-300 text-sm mr-3 font-medium">Edit</router-link>
                <button @click="confirmDelete(row.id as string)"
                    class="text-red-400 hover:text-red-300 text-sm font-medium">Delete</button>
            </template>
            <template #footer>
                <Pagination v-if="total > 0" :page="page" :total-pages="totalPages" :total="total"
                    @page-change="changePage" />
            </template>
        </DataTable>

        <Modal v-model="showDeleteModal" title="Delete Product">
            <p class="text-dark-400">Are you sure you want to delete this product? This action cannot be undone.</p>
            <template #actions>
                <button @click="showDeleteModal = false" class="btn-secondary">Cancel</button>
                <button @click="deleteProduct" class="btn-danger">Delete</button>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useProductStore } from '../../stores/product.store';
import { useCategoryStore } from '../../stores/category.store';
import DataTable from '../../components/ui/DataTable.vue';
import Pagination from '../../components/ui/Pagination.vue';
import Modal from '../../components/ui/Modal.vue';

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const loading = ref(false);
const page = ref(1);
const limit = 20;
const total = ref(0);
const totalPages = ref(0);
const showDeleteModal = ref(false);
const deleteTarget = ref('');

const filters = reactive({ search: '', categoryId: '', status: '' });
const columns = [
    { key: 'name', label: 'Product' },
    { key: 'salePrice', label: 'Price' },
    { key: 'stockQuantity', label: 'Stock' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created' },
];
const categories = categoryStore.categories;

let debounceTimer: ReturnType<typeof setTimeout>;
function debouncedSearch() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => { page.value = 1; fetchProducts(); }, 300);
}

async function fetchProducts() {
    loading.value = true;
    try {
        const params: Record<string, unknown> = { page: page.value, limit };
        if (filters.search) params.search = filters.search;
        if (filters.categoryId) params.categoryId = filters.categoryId;
        if (filters.status) params.status = filters.status;
        const res = await productStore.fetchAll(params);
        if (res) { total.value = res.meta.total; totalPages.value = res.meta.totalPages; }
    } finally { loading.value = false; }
}

function changePage(p: number) { page.value = p; fetchProducts(); }
function confirmDelete(id: string) { deleteTarget.value = id; showDeleteModal.value = true; }
async function deleteProduct() { await productStore.remove(deleteTarget.value); showDeleteModal.value = false; fetchProducts(); }
function statusClass(status: string) {
    return status === 'active' ? 'badge-success' : status === 'inactive' ? 'badge-warning' : 'badge-danger';
}
function formatDate(date: string) { return new Date(date).toLocaleDateString(); }
const products = productStore.products;

onMounted(async () => { await categoryStore.fetchAll(); fetchProducts(); });
</script>
