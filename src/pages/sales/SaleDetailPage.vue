<template>
    <div v-if="sale">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="heading">{{ t('sales.saleDetails') }}</h1>
                <p class="subheading mt-1">{{ t('header.transactionInfo') }}</p>
            </div>
            <router-link to="/sales" class="btn-secondary">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {{ t('common.back') }}
            </router-link>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div class="card p-5">
                <p class="text-xs font-medium text-dark-400 uppercase tracking-wider mb-1">{{ t('sales.customerLabel') }}</p>
                <p class="text-base font-semibold text-dark-50">{{ sale.customerName }}</p>
            </div>
            <div class="card p-5">
                <p class="text-xs font-medium text-dark-400 uppercase tracking-wider mb-1">{{ t('sales.totalAmount') }}</p>
                <p class="text-base font-semibold text-dark-50">${{ Number(sale.total).toLocaleString() }}</p>
            </div>
            <div class="card p-5">
                <p class="text-xs font-medium text-dark-400 uppercase tracking-wider mb-1">{{ t('sales.statusLabel') }}</p>
                <span :class="sale.status === 'completed' ? 'badge-success' : 'badge-warning'" class="mt-1">{{
                    sale.status }}</span>
            </div>
            <div class="card p-5">
                <p class="text-xs font-medium text-dark-400 uppercase tracking-wider mb-1">{{ t('sales.dateLabel') }}</p>
                <p class="text-base font-semibold text-dark-50">{{ formatDate(sale.createdAt) }}</p>
            </div>
            <div class="card p-5">
                <p class="text-xs font-medium text-dark-400 uppercase tracking-wider mb-1">{{ t('sales.createdBy') }}</p>
                <p class="text-base font-semibold text-dark-50">{{ sale.createdBy?.name || 'N/A' }}</p>
            </div>
            <div class="card p-5">
                <p class="text-xs font-medium text-dark-400 uppercase tracking-wider mb-1">{{ t('sales.taxLabel') }}</p>
                <p class="text-base font-semibold text-dark-50">${{ Number(sale.tax).toFixed(2) }}</p>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3 class="text-base font-semibold text-dark-50">{{ t('sales.items') }}</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-dark-700/30">
                    <thead class="bg-dark-850/50">
                        <tr>
                            <th class="px-6 py-3.5 text-left text-xs font-semibold text-dark-400 uppercase">{{ t('sales.productCol') }}</th>
                            <th class="px-6 py-3.5 text-left text-xs font-semibold text-dark-400 uppercase">{{ t('sales.skuCol') }}</th>
                            <th class="px-6 py-3.5 text-right text-xs font-semibold text-dark-400 uppercase">{{ t('sales.qtyCol') }}</th>
                            <th class="px-6 py-3.5 text-right text-xs font-semibold text-dark-400 uppercase">{{ t('sales.unitPriceCol') }}
                            </th>
                            <th class="px-6 py-3.5 text-right text-xs font-semibold text-dark-400 uppercase">{{ t('sales.subtotalCol') }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-dark-700/30">
                        <tr v-for="item in sale.items" :key="item.id" class="hover:bg-dark-750/50">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark-200">{{ item.product?.name }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark-400">{{ item.product?.sku }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-dark-300">{{ item.quantity }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-dark-300">${{
                                Number(item.unitPrice).toFixed(2) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-dark-200">${{
                                Number(item.subtotal).toFixed(2) }}</td>
                        </tr>
                    </tbody>
                    <tfoot class="bg-dark-850/30">
                        <tr>
                            <td colspan="4" class="px-6 py-3.5 text-sm font-medium text-dark-400 text-right">{{ t('sales.subtotalFooter') }}
                            </td>
                            <td class="px-6 py-3.5 text-sm font-medium text-dark-200 text-right">${{
                                Number(sale.subtotal).toFixed(2) }}</td>
                        </tr>
                        <tr>
                            <td colspan="4" class="px-6 py-3.5 text-sm text-dark-400 text-right">{{ t('sales.taxFooter') }}</td>
                            <td class="px-6 py-3.5 text-sm text-dark-400 text-right">${{ Number(sale.tax).toFixed(2) }}
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4" class="px-6 py-3.5 text-sm font-bold text-dark-50 text-right">{{ t('sales.totalFooter') }}</td>
                            <td class="px-6 py-3.5 text-sm font-bold text-dark-50 text-right">${{
                                Number(sale.total).toFixed(2) }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
    <div v-else class="flex items-center justify-center py-16">
        <div class="flex items-center gap-2 text-dark-500">
            <div class="w-5 h-5 border-2 border-lz-500/30 border-t-lz-500 rounded-full animate-spin" />
            <span class="text-sm">{{ t('common.loading') }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSaleStore } from '../../stores/sale.store';
import { useLocaleStore } from '../../stores/locale.store';

const { t } = useLocaleStore();

const route = useRoute();
const saleStore = useSaleStore();
const sale = computed(() => saleStore.currentSale);
function formatDate(date: string) { return new Date(date).toLocaleString(); }
onMounted(() => saleStore.fetchById(route.params.id as string));
</script>
