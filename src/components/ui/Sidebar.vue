<template>
    <aside class="fixed inset-y-0 left-0 z-30 w-64 bg-dark-850 border-r border-dark-700/50 hidden lg:block">
        <div class="flex items-center gap-3 h-16 px-6 border-b border-dark-700/50">
            <div
                class="w-8 h-8 rounded-lg bg-gradient-to-br from-lz-500 to-lz-700 flex items-center justify-center shadow-lg shadow-lz-600/20">
                <span class="text-white font-bold text-sm">LZ</span>
            </div>
            <span class="text-lg font-bold text-dark-50 tracking-tight">LZFlow</span>
        </div>
        <nav class="p-4 space-y-1">
            <template v-for="item in menuItems" :key="item.path">
                <router-link :to="item.path" v-if="!item.roles || item.roles.includes(authStore.user?.role || '')"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                    :class="isActive(item.path)
                        ? 'bg-lz-500/10 text-lz-400 border border-lz-500/20'
                        : 'text-dark-400 hover:text-dark-200 hover:bg-dark-750 hover:border-dark-600 border border-transparent'">
                    <span class="text-lg">{{ item.icon }}</span>
                    {{ item.label }}
                </router-link>
            </template>
        </nav>
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-700/50">
            <div class="flex items-center gap-3 px-3 py-2">
                <div
                    class="w-8 h-8 rounded-full bg-gradient-to-br from-lz-500/30 to-lz-700/30 flex items-center justify-center border border-dark-600">
                    <span class="text-xs font-medium text-dark-300">{{ authStore.user?.name?.charAt(0)?.toUpperCase()
                        }}</span>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-dark-200 truncate">{{ authStore.user?.name }}</p>
                    <p class="text-xs text-dark-500 truncate">{{ authStore.user?.email }}</p>
                </div>
            </div>
        </div>
    </aside>

    <div v-if="mobileOpen" class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        @click="mobileOpen = false" />
    <aside
        class="fixed inset-y-0 left-0 z-50 w-64 bg-dark-850 border-r border-dark-700/50 lg:hidden transition-transform duration-200"
        :class="mobileOpen ? 'translate-x-0' : '-translate-x-full'">
        <div class="flex items-center justify-between h-16 px-6 border-b border-dark-700/50">
            <div class="flex items-center gap-3">
                <div
                    class="w-8 h-8 rounded-lg bg-gradient-to-br from-lz-500 to-lz-700 flex items-center justify-center">
                    <span class="text-white font-bold text-sm">LZ</span>
                </div>
                <span class="text-lg font-bold text-dark-50">LZFlow</span>
            </div>
            <button @click="mobileOpen = false" class="text-dark-400 hover:text-white p-1">&times;</button>
        </div>
        <nav class="p-4 space-y-1">
            <template v-for="item in menuItems" :key="item.path">
                <router-link :to="item.path" @click="mobileOpen = false"
                    v-if="!item.roles || item.roles.includes(authStore.user?.role || '')"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                    :class="isActive(item.path)
                        ? 'bg-lz-500/10 text-lz-400 border border-lz-500/20'
                        : 'text-dark-400 hover:text-dark-200 hover:bg-dark-750 border border-transparent'">
                    <span class="text-lg">{{ item.icon }}</span>
                    {{ item.label }}
                </router-link>
            </template>
        </nav>
    </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';

const route = useRoute();
const authStore = useAuthStore();
const mobileOpen = ref(false);

import { useLocaleStore } from '../../stores/locale.store';

const localeStore = useLocaleStore();

const menuItems = computed(() => [
    { path: '/dashboard', label: localeStore.t('sidebar.dashboard'), icon: '📊', roles: undefined },
    { path: '/products', label: localeStore.t('sidebar.products'), icon: '📦', roles: undefined },
    { path: '/suppliers', label: localeStore.t('sidebar.suppliers'), icon: '🚚', roles: undefined },
    { path: '/sales', label: localeStore.t('sidebar.sales'), icon: '💰', roles: undefined },
    { path: '/categories', label: localeStore.t('sidebar.categories'), icon: '🏷️', roles: undefined },
    { path: '/users', label: localeStore.t('sidebar.users'), icon: '👥', roles: ['owner'] },
    { path: '/settings', label: localeStore.t('sidebar.settings'), icon: '⚙️', roles: undefined },
]);

function isActive(path: string) {
    return route.path.startsWith(path);
}

defineExpose({ mobileOpen });
</script>
