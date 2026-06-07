import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import AuthLayout from '../layouts/AuthLayout.vue';

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
