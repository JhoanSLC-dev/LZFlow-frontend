import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types';
import { authService } from '../services/auth.service';
import router from '../router';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
    const accessToken = ref<string | null>(localStorage.getItem('accessToken'));
    const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'));
    const loading = ref(false);

    const isAuthenticated = computed(() => !!accessToken.value);
    const isOwner = computed(() => user.value?.role === 'owner');
    const isManager = computed(() => user.value?.role === 'manager' || user.value?.role === 'owner');
    const organizationId = computed(() => user.value?.organizationId);

    async function login(email: string, password: string) {
        loading.value = true;
        try {
            const response = await authService.login({ email, password });
            setSession(response);
            return response;
        } finally {
            loading.value = false;
        }
    }

    async function register(data: {
        organizationName: string;
        name: string;
        email: string;
        password: string;
    }) {
        loading.value = true;
        try {
            const response = await authService.register(data);
            setSession(response);
            return response;
        } finally {
            loading.value = false;
        }
    }

    function setSession(response: { user: User; accessToken: string; refreshToken: string }) {
        user.value = response.user;
        accessToken.value = response.accessToken;
        refreshToken.value = response.refreshToken;
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
    }

    function logout() {
        user.value = null;
        accessToken.value = null;
        refreshToken.value = null;
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/login');
    }

    return {
        user,
        accessToken,
        refreshToken,
        loading,
        isAuthenticated,
        isOwner,
        isManager,
        organizationId,
        login,
        register,
        logout,
        setSession,
    };
});
