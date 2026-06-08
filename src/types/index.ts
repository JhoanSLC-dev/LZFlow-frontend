export interface User {
    id: string;
    email: string;
    name: string;
    role: 'owner' | 'manager' | 'employee';
    organizationId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ApiError {
    success: false;
    error: string;
    details?: Record<string, string[]>;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface DashboardData {
    totalSales: number;
    totalRevenue: number;
    todayRevenue: number;
    monthRevenue: number;
    yearRevenue: number;
    inventoryValue: number;
    lowStockCount: number;
    totalProducts: number;
}

export interface MonthlyRevenue {
    month: number;
    sales_count: number;
    revenue: number;
}

export interface TopProduct {
    id: string;
    name: string;
    sku: string;
    total_quantity: number;
    total_revenue: number;
}

export interface SalesTrend {
    date: string;
    sales_count: number;
    revenue: number;
}

export interface InventoryValuation {
    costValue: number;
    saleValue: number;
    totalProducts: number;
    totalStock: number;
}

export interface Category {
    id: string;
    organizationId: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Supplier {
    id: string;
    organizationId: string;
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    address: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    id: string;
    organizationId: string;
    categoryId: string | null;
    supplierId: string | null;
    sku: string;
    name: string;
    description: string | null;
    costPrice: string;
    salePrice: string;
    stockQuantity: number;
    minimumStock: number;
    status: 'active' | 'inactive' | 'discontinued';
    category?: Category;
    supplier?: Supplier;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
