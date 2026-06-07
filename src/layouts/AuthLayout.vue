<template>
    <div
        class="min-h-screen flex items-center justify-center bg-dark-950 relative overflow-hidden px-4 sm:px-6 lg:px-8">
        <div
            class="absolute inset-0 bg-gradient-to-br from-lz-950/40 via-dark-950 to-dark-900/80 pointer-events-none" />
        <div class="absolute top-20 -left-20 w-96 h-96 bg-lz-500/5 rounded-full blur-3xl" />
        <div class="absolute bottom-20 -right-20 w-96 h-96 bg-lz-700/5 rounded-full blur-3xl" />
        <div class="w-full max-w-md relative">
            <div class="text-center mb-8">
                <div class="flex items-center justify-center gap-3 mb-3">
                    <div
                        class="w-10 h-10 rounded-xl bg-gradient-to-br from-lz-500 to-lz-700 flex items-center justify-center shadow-lg shadow-lz-600/30">
                        <span class="text-white font-bold text-lg">LZ</span>
                    </div>
                    <h1 class="text-3xl font-bold text-dark-50 tracking-tight">LZFlow</h1>
                </div>
                <p class="text-dark-400 text-sm">{{ localeStore.t('auth.tagline') }}</p>
            </div>
            <div
                class="bg-dark-800/90 backdrop-blur-xl rounded-2xl border border-dark-700/50 shadow-2xl shadow-black/30 p-8">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useLocaleStore } from '../stores/locale.store';
const localeStore = useLocaleStore();
</script>
