<template>
    <div>
        <div class="mb-6">
            <h1 class="heading">Settings</h1>
            <p class="subheading mt-1">Organization configuration</p>
        </div>

        <div class="card max-w-2xl mb-6">
            <div class="card-header">
                <div class="flex items-center gap-3">
                    <div
                        class="w-8 h-8 rounded-lg bg-gradient-to-br from-lz-500/20 to-lz-700/20 flex items-center justify-center border border-dark-600">
                        <span class="text-sm">🏢</span>
                    </div>
                    <h3 class="font-semibold text-dark-50">Organization</h3>
                </div>
            </div>
            <div class="p-6 space-y-4">
                <div class="flex items-center justify-between p-3 rounded-xl bg-dark-750/50 border border-dark-600/50">
                    <div>
                        <p class="text-sm text-dark-300 font-medium">Organization ID</p>
                        <p class="text-xs text-dark-500 mt-0.5 font-mono">{{ authStore.user?.organizationId }}</p>
                    </div>
                    <span class="badge-info">Active</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-xl bg-dark-750/50 border border-dark-600/50">
                    <div>
                        <p class="text-sm text-dark-300 font-medium">Your Account</p>
                        <p class="text-xs text-dark-500 mt-0.5">{{ authStore.user?.name }} · {{ authStore.user?.email }}
                        </p>
                    </div>
                    <span class="badge-info">{{ authStore.user?.role }}</span>
                </div>
            </div>
        </div>

        <div class="card max-w-2xl">
            <div class="card-header">
                <div class="flex items-center gap-3">
                    <div
                        class="w-8 h-8 rounded-lg bg-gradient-to-br from-lz-500/20 to-lz-700/20 flex items-center justify-center border border-dark-600">
                        <span class="text-sm">🔌</span>
                    </div>
                    <h3 class="font-semibold text-dark-50">API Information</h3>
                </div>
            </div>
            <div class="p-6 space-y-3">
                <div class="flex items-center gap-3 p-3 rounded-xl bg-dark-750/50 border border-dark-600/50">
                    <span class="text-xs font-medium text-dark-400 w-24">API Base URL</span>
                    <code class="text-sm text-lz-400 font-mono flex-1">{{ apiUrl }}</code>
                    <button @click="copyToClipboard"
                        class="text-dark-400 hover:text-lz-400 text-xs font-medium">Copy</button>
                </div>
                <div class="flex items-center gap-3 p-3 rounded-xl bg-dark-750/50 border border-dark-600/50">
                    <span class="text-xs font-medium text-dark-400 w-24">API Docs</span>
                    <a :href="apiUrl + '/docs'" target="_blank"
                        class="text-sm text-lz-400 hover:text-lz-300 font-mono flex-1">{{ apiUrl }}/docs</a>
                    <svg class="w-4 h-4 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth.store';

const authStore = useAuthStore();
const apiUrl = '/api';
const copied = ref(false);

async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(apiUrl);
        copied.value = true;
        setTimeout(() => { copied.value = false; }, 2000);
    } catch { /* ignore */ }
}
</script>
