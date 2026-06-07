<template>
    <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-semibold text-dark-50">{{ t('dashboard.monthlyRevenue') }}</h3>
            <span class="text-xs text-dark-500">{{ t('dashboard.currentYear') }}</span>
        </div>
        <div v-if="loading" class="h-64 flex items-center justify-center">
            <div class="flex items-center gap-2 text-dark-500">
                <div class="w-5 h-5 border-2 border-lz-500/30 border-t-lz-500 rounded-full animate-spin" />
                <span class="text-sm">Loading...</span>
            </div>
        </div>
        <div v-else class="h-64">
            <Bar :data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import type { MonthlyRevenue } from '../../types';
import { useThemeStore } from '../../stores/theme.store';
import { useLocaleStore } from '../../stores/locale.store';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const themeStore = useThemeStore();
const { t } = useLocaleStore();

const props = defineProps({
    data: { type: Array as () => MonthlyRevenue[], default: () => [] },
    loading: { type: Boolean, default: false },
});

const chartData = computed(() => ({
    labels: props.data.map((d) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[d.month - 1];
    }),
    datasets: [
        {
            label: 'Revenue',
            backgroundColor: 'rgba(139, 92, 246, 0.6)',
            borderColor: 'rgba(139, 92, 246, 0.8)',
            borderWidth: 1,
            borderRadius: 6,
            data: props.data.map((d) => d.revenue),
        },
    ],
}));

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: themeStore.isDark ? '#1e293b' : '#ffffff',
            titleColor: themeStore.isDark ? '#f1f5f9' : '#1e293b',
            bodyColor: themeStore.isDark ? '#94a3b8' : '#64748b',
            borderColor: themeStore.isDark ? '#334155' : '#e2e8f0',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
        },
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: themeStore.isDark ? '#64748b' : '#94a3b8', font: { size: 11 } },
        },
        y: {
            beginAtZero: true,
            grid: { color: themeStore.isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(203, 213, 225, 0.5)', drawBorder: false },
            ticks: {
                color: themeStore.isDark ? '#64748b' : '#94a3b8',
                font: { size: 11 },
                callback: (v: string | number) => `$${Number(v).toLocaleString()}`,
            },
        },
    },
}));
</script>
