<template>
    <header class="sticky top-0 z-20 bg-dark-850/80 backdrop-blur-xl border-b border-dark-700/50 h-16">
        <div class="flex items-center justify-between h-full px-4 sm:px-6">
            <div class="flex items-center gap-4">
                <button
                    class="lg:hidden text-dark-400 hover:text-dark-100 p-1.5 rounded-lg hover:bg-dark-750 transition-colors"
                    @click="$emit('toggle-sidebar')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div>
                    <h2 class="text-lg font-semibold text-dark-50">{{ pageTitle }}</h2>
                    <p class="text-xs text-dark-500 hidden sm:block">{{ pageSubtitle }}</p>
                </div>
            </div>
            <div class="flex items-center gap-2 sm:gap-3">
                <button @click="themeStore.toggle()" class="btn-ghost btn-sm p-2 rounded-xl text-dark-400"
                    :title="localeStore.t(themeStore.isDark ? 'common.lightMode' : 'common.darkMode')">
                    <svg v-if="themeStore.isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                </button>

                <div class="relative" v-click-outside="() => langOpen = false">
                    <button @click="langOpen = !langOpen"
                        class="btn-ghost btn-sm px-2 py-2 rounded-xl text-dark-400 font-medium text-xs uppercase tracking-wider">
                        {{ localeStore.locale }}
                    </button>
                    <div v-if="langOpen"
                        class="absolute right-0 top-full mt-1 w-28 bg-dark-800 border border-dark-700 rounded-xl shadow-xl overflow-hidden z-50">
                        <button v-for="lang in languages" :key="lang.value"
                            @click="localeStore.setLocale(lang.value); langOpen = false"
                            class="flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors"
                            :class="localeStore.locale === lang.value ? 'text-lz-400 bg-lz-500/10' : 'text-dark-300 hover:bg-dark-750'">
                            <span class="text-base">{{ lang.flag }}</span>
                            {{ lang.label }}
                        </button>
                    </div>
                </div>

                <div class="hidden sm:flex items-center gap-3 ml-2">
                    <div class="text-right">
                        <p class="text-sm font-medium text-dark-200">{{ authStore.user?.name }}</p>
                        <p class="text-xs text-dark-500 capitalize">{{ authStore.user?.role }}</p>
                    </div>
                    <div
                        class="w-9 h-9 rounded-full bg-gradient-to-br from-lz-500/30 to-lz-700/30 flex items-center justify-center border border-dark-600">
                        <span class="text-sm font-medium text-lz-400">{{ authStore.user?.name?.charAt(0)?.toUpperCase()
                            }}</span>
                    </div>
                </div>
                <button @click="authStore.logout()" class="btn-ghost btn-sm text-dark-400">
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {{ localeStore.t('common.logout') }}
                </button>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';
import { useThemeStore } from '../../stores/theme.store';
import { useLocaleStore } from '../../stores/locale.store';
import { vClickOutside } from '../../directives/clickOutside';

defineEmits(['toggle-sidebar']);
const route = useRoute();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const localeStore = useLocaleStore();

const langOpen = ref(false);

const languages = computed(() => [
    { value: 'en' as const, label: localeStore.t('header.languageEn'), flag: '🇬🇧' },
    { value: 'es' as const, label: localeStore.t('header.languageEs'), flag: '🇪🇸' },
]);

const pageInfo = computed(() => {
    const name = route.name as string;
    const t = localeStore.t;
    const pages: Record<string, { title: string; subtitle: string }> = {
        Dashboard: { title: t('dashboard.title'), subtitle: t('dashboard.subtitle') },
        Products: { title: t('sidebar.products'), subtitle: t('header.manageInventory') },
        ProductCreate: { title: t('header.addProduct'), subtitle: t('header.addProduct') },
        ProductEdit: { title: t('header.editProduct'), subtitle: t('header.editProduct') },
        Categories: { title: t('sidebar.categories'), subtitle: t('header.organizeProducts') },
        Suppliers: { title: t('sidebar.suppliers'), subtitle: t('header.manageSuppliers') },
        Sales: { title: t('sidebar.sales'), subtitle: t('header.viewTransactions') },
        SaleCreate: { title: t('header.newTransaction'), subtitle: t('header.newTransaction') },
        SaleDetail: { title: t('header.transactionInfo'), subtitle: t('header.transactionInfo') },
        Users: { title: t('sidebar.users'), subtitle: t('header.manageTeam') },
        Settings: { title: t('sidebar.settings'), subtitle: t('header.orgConfig') },
    };
    return pages[name] || { title: 'LZFlow', subtitle: t('header.defaultSubtitle') };
});

const pageTitle = computed(() => pageInfo.value.title);
const pageSubtitle = computed(() => pageInfo.value.subtitle);
</script>
