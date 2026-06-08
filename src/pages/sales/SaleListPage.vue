<template>
    <div>
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="heading">{{ t('sales.title') }}</h1>
                <p class="subheading mt-1">{{ t('header.viewTransactions') }}</p>
            </div>
            <router-link to="/sales/new" class="btn-primary">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                {{ t('sales.new') }}
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
                    <input v-model="filters.customerName" :placeholder="t('sales.searchPlaceholder')" class="input pl-10"
                        @input="debouncedSearch" />
                </div>
                <select v-model="filters.status" class="input w-36" @change="fetchSales">
                    <option value="">{{ t('sales.allStatus') }}</option>
                    <option value="completed">{{ t('sales.completed') }}</option>
                    <option value="cancelled">{{ t('sales.cancelled') }}</option>
                    <option value="refunded">{{ t('sales.refunded') }}</option>
                </select>
            </div>
        </div>

        <DataTable :columns="columns" :data="saleStore.sales as unknown as Record<string, unknown>[]">
            <template #cell-total="{ row }">
                <span class="text-dark-200 font-medium">${{ Number(row.total).toLocaleString() }}</span>
            </template>
            <template #cell-status="{ row }">
                <span
                    :class="row.status === 'completed' ? 'badge-success' : row.status === 'cancelled' ? 'badge-danger' : 'badge-warning'">
                    {{ row.status }}
                </span>
            </template>
            <template #cell-createdAt="{ row }">
                <span class="text-dark-400">{{ formatDate(row.createdAt as string) }}</span>
            </template>
            <template #actions="{ row }">
                <router-link :to="`/sales/${row.id}`"
                    class="text-lz-400 hover:text-lz-300 text-sm font-medium">{{ t('sales.view') }}</router-link>
            </template>
            <template #footer>
                <Pagination v-if="total > 0" :page="page" :total-pages="totalPages" :total="total"
                    @page-change="changePage" />
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useSaleStore } from '../../stores/sale.store';
import { useLocaleStore } from '../../stores/locale.store';
import DataTable from '../../components/ui/DataTable.vue';
import Pagination from '../../components/ui/Pagination.vue';

const { t } = useLocaleStore();

const saleStore = useSaleStore();
const loading = ref(false);
const page = ref(1);
const limit = 20;
const total = ref(0);
const totalPages = ref(0);
const filters = reactive({ customerName: '', status: '' });
const columns = computed(() => [{ key: 'customerName', label: t('sales.customer') }, { key: 'total', label: t('sales.total') }, { key: 'status', label: t('sales.status') }, { key: 'createdAt', label: t('sales.date') }]);

let debounceTimer: ReturnType<typeof setTimeout>;
function debouncedSearch() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => { page.value = 1; fetchSales(); }, 300);
}
async function fetchSales() {
    loading.value = true;
    try {
        const params: Record<string, unknown> = { page: page.value, limit };
        if (filters.customerName) params.customerName = filters.customerName;
        if (filters.status) params.status = filters.status;
        const res = await saleStore.fetchAll(params);
        if (res) { total.value = res.meta.total; totalPages.value = res.meta.totalPages; }
    } finally { loading.value = false; }
}
function changePage(p: number) { page.value = p; fetchSales(); }
function formatDate(date: string) { return new Date(date).toLocaleDateString(); }
onMounted(() => fetchSales());
</script>
