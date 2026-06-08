import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import AuthLayout from '../layouts/AuthLayout.vue';
import DashboardLayout from '../layouts/DashboardLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/dashboard',
        },
        {
            path: '/',
            component: AuthLayout,
            children: [
                {
                    path: 'login',
                    name: 'Login',
                    component: () => import('../pages/auth/LoginPage.vue'),
                    meta: { guest: true },
                },
                {
                    path: 'register',
                    name: 'Register',
                    component: () => import('../pages/auth/RegisterPage.vue'),
                    meta: { guest: true },
                },
                {
                    path: 'forgot-password',
                    name: 'ForgotPassword',
                    component: () => import('../pages/auth/ForgotPasswordPage.vue'),
                    meta: { guest: true },
                },
            ],
        },
        {
            path: '/',
            component: DashboardLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: 'dashboard',
                    name: 'Dashboard',
                    component: () => import('../pages/dashboard/DashboardPage.vue'),
                },
                {
                    path: 'products',
                    name: 'Products',
                    component: () => import('../pages/products/ProductListPage.vue'),
                },
                {
                    path: 'products/new',
                    name: 'ProductCreate',
                    component: () => import('../pages/products/ProductFormPage.vue'),
                },
                {
                    path: 'products/:id/edit',
                    name: 'ProductEdit',
                    component: () => import('../pages/products/ProductFormPage.vue'),
                },
                {
                    path: 'categories',
                    name: 'Categories',
                    component: () => import('../pages/categories/CategoryListPage.vue'),
                },
                {
                    path: 'users',
                    name: 'Users',
                    component: () => import('../pages/users/UserListPage.vue'),
                    meta: { roles: ['owner'] },
                },
            ],
        },
    ],
});

router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login');
        return;
    }

    if (to.meta.guest && authStore.isAuthenticated) {
        next('/dashboard');
        return;
    }

    if (to.meta.roles && authStore.user) {
        const roles = to.meta.roles as string[];
        if (!roles.includes(authStore.user.role)) {
            next('/dashboard');
            return;
        }
    }

    next();
});

export default router;
