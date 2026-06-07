<template>
    <div>
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-dark-50">{{ t('dashboard.title') }}</h1>
                <p class="text-sm text-dark-400 mt-1">{{ t('dashboard.subtitle') }}</p>
            </div>
            <div
                class="flex items-center gap-2 text-xs text-dark-500 bg-dark-800 rounded-xl px-3 py-2 border border-dark-700/50">
                <div class="w-2 h-2 rounded-full bg-emerald-400" />
                {{ t('dashboard.live') }}
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KpiCard :title="t('dashboard.totalRevenue')" :value="dashboard.totalRevenue" format="currency" icon="💰" />
            <KpiCard :title="t('dashboard.todaysRevenue')" :value="dashboard.todayRevenue" format="currency"
                icon="📈" />
            <KpiCard :title="t('dashboard.monthlyRevenue')" :value="dashboard.monthRevenue" format="currency"
                icon="📊" />
            <KpiCard :title="t('dashboard.totalSales')" :value="dashboard.totalSales" icon="🛒" />
            <KpiCard :title="t('dashboard.inventoryValue')" :value="dashboard.inventoryValue" format="currency"
                icon="📦" />
            <KpiCard :title="t('dashboard.products')" :value="dashboard.totalProducts" icon="🏷️" />
            <KpiCard :title="t('dashboard.lowStockItems')" :value="dashboard.lowStockCount" icon="⚠️"
                :subtitle="t('dashboard.itemsBelowMin')" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RevenueChart :data="monthlyRevenue" :loading="loading" />
            <SalesTrendChart :data="salesTrend" :loading="loading" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card p-6">
                <h3 class="text-base font-semibold text-dark-50 mb-4">{{ t('dashboard.topSelling') }}</h3>
                <div v-if="loading" class="flex items-center justify-center py-12">
                    <div class="w-5 h-5 border-2 border-lz-500/30 border-t-lz-500 rounded-full animate-spin" />
                </div>
                <div v-else-if="topProducts.length === 0" class="text-dark-500 text-center py-12 text-sm">{{
                    t('dashboard.noSalesData') }}</div>
                <div v-else class="space-y-2">
                    <div v-for="(product, index) in topProducts" :key="product.id"
                        class="flex items-center justify-between p-3 rounded-xl hover:bg-dark-750/50 transition-colors">
                        <div class="flex items-center gap-3">
                            <span
                                class="w-6 h-6 rounded-lg bg-dark-750 flex items-center justify-center text-xs font-medium text-dark-400">#{{
                                index + 1 }}</span>
                            <div>
                                <p class="text-sm font-medium text-dark-200">{{ product.name }}</p>
                                <p class="text-xs text-dark-500">{{ product.sku }}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-semibold text-dark-200">{{ product.total_quantity }} {{
                                t('dashboard.sold') }}</p>
                            <p class="text-xs text-dark-500">${{ Number(product.total_revenue).toLocaleString() }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card p-6">
                <h3 class="text-base font-semibold text-dark-50 mb-4">{{ t('dashboard.lowStockAlerts') }}</h3>
                <div v-if="loading" class="flex items-center justify-center py-12">
                    <div class="w-5 h-5 border-2 border-lz-500/30 border-t-lz-500 rounded-full animate-spin" />
                </div>
                <div v-else-if="lowStockProducts.length === 0" class="text-dark-500 text-center py-12 text-sm">{{
                    t('dashboard.wellStocked') }}</div>
                <div v-else class="space-y-2">
                    <div v-for="product in lowStockProducts.slice(0, 5)" :key="product.id"
                        class="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                        <div>
                            <p class="text-sm font-medium text-dark-200">{{ product.name }}</p>
                            <p class="text-xs text-red-400/80">Stock: {{ product.stockQuantity }} / Min: {{
                                product.minimumStock }}</p>
                        </div>
                        <router-link :to="`/products/${product.id}/edit`"
                            class="text-sm text-lz-400 hover:text-lz-300 font-medium">{{ t('dashboard.restock')
                            }}</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { reportService } from '../../services/report.service';
import { useLocaleStore } from '../../stores/locale.store';
import KpiCard from '../../components/ui/KpiCard.vue';
import RevenueChart from '../../components/charts/RevenueChart.vue';
import SalesTrendChart from '../../components/charts/SalesTrendChart.vue';
import type { DashboardData, MonthlyRevenue, TopProduct, SalesTrend, Product } from '../../types';

const { t } = useLocaleStore();

const loading = ref(true);
const dashboard = ref<DashboardData>({
    totalSales: 0, totalRevenue: 0, todayRevenue: 0, monthRevenue: 0, yearRevenue: 0,
    inventoryValue: 0, lowStockCount: 0, totalProducts: 0,
});
const monthlyRevenue = ref<MonthlyRevenue[]>([]);
const topProducts = ref<TopProduct[]>([]);
const salesTrend = ref<SalesTrend[]>([]);
const lowStockProducts = ref<Product[]>([]);

onMounted(async () => {
    try {
        const [dash, revenue, products, trend, lowStock] = await Promise.all([
            reportService.getDashboard(),
            reportService.getMonthlyRevenue(),
            reportService.getTopProducts(5),
            reportService.getSalesTrend(30),
            reportService.getLowStockProducts(),
        ]);
        dashboard.value = dash;
        monthlyRevenue.value = revenue;
        topProducts.value = products;
        salesTrend.value = trend;
        lowStockProducts.value = lowStock;
    } catch (err) {
        console.error('Failed to load dashboard:', err);
    } finally {
        loading.value = false;
    }
});
</script>
