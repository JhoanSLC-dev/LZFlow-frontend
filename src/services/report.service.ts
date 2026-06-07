import api from './api';
import type {
    DashboardData,
    MonthlyRevenue,
    TopProduct,
    SalesTrend,
    InventoryValuation,
    Product,
} from '../types';

export const reportService = {
    async getDashboard(): Promise<DashboardData> {
        const { data } = await api.get('/reports/dashboard');
        return data.data;
    },

    async getMonthlyRevenue(year?: number): Promise<MonthlyRevenue[]> {
        const { data } = await api.get('/reports/monthly-revenue', {
            params: { year },
        });
        return data.data;
    },

    async getTopProducts(limit = 10): Promise<TopProduct[]> {
        const { data } = await api.get('/reports/top-products', {
            params: { limit },
        });
        return data.data;
    },

    async getSalesTrend(days = 30): Promise<SalesTrend[]> {
        const { data } = await api.get('/reports/sales-trend', {
            params: { days },
        });
        return data.data;
    },

    async getInventoryValuation(): Promise<InventoryValuation> {
        const { data } = await api.get('/reports/inventory-valuation');
        return data.data;
    },

    async getLowStockProducts(): Promise<Product[]> {
        const { data } = await api.get('/reports/low-stock');
        return data.data;
    },
};
