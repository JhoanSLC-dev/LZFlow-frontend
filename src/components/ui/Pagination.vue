<template>
    <div class="flex items-center justify-between flex-wrap gap-4">
        <p class="text-sm text-dark-400">
            {{ t('pagination.page') }} <span class="text-dark-200 font-medium">{{ page }}</span> {{ t('pagination.of') }} <span class="text-dark-200 font-medium">{{
                totalPages }}</span>
            <span class="mx-1">·</span>
            <span class="text-dark-500">{{ t('pagination.totalRecords', { total }) }}</span>
        </p>
        <div class="flex items-center gap-2">
            <button @click="$emit('page-change', page - 1)" :disabled="page <= 1" class="btn-ghost btn-sm">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                {{ t('pagination.prev') }}
            </button>
            <template v-for="p in displayedPages" :key="p">
                <span v-if="p === -1" class="px-2 text-dark-600">…</span>
                <button v-else @click="$emit('page-change', p)"
                    class="min-w-[2rem] h-8 rounded-lg text-sm font-medium transition-all duration-150" :class="p === page
                        ? 'bg-lz-500/15 text-lz-400 border border-lz-500/20'
                        : 'text-dark-400 hover:text-dark-200 hover:bg-dark-750'">
                    {{ p }}
                </button>
            </template>
            <button @click="$emit('page-change', page + 1)" :disabled="page >= totalPages" class="btn-ghost btn-sm">
                {{ t('pagination.next') }}
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLocaleStore } from '../../stores/locale.store';

const { t } = useLocaleStore();

const props = defineProps({
    page: { type: Number, required: true },
    totalPages: { type: Number, required: true },
    total: { type: Number, required: true },
});

defineEmits(['page-change']);

const displayedPages = computed(() => {
    const delta = 2;
    const range: number[] = [];
    for (
        let i = Math.max(2, props.page - delta);
        i <= Math.min(props.totalPages - 1, props.page + delta);
        i++
    ) {
        range.push(i);
    }
    if (props.page - delta > 2) range.unshift(-1);
    if (props.page + delta < props.totalPages - 1) range.push(-1);
    return [1, ...range, props.totalPages].filter((p) => p > 0);
});
</script>
