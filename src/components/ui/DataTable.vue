<template>
    <div class="card overflow-hidden">
        <div v-if="$slots.header" class="card-header">
            <slot name="header" />
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-dark-700/50">
                <thead class="bg-dark-850/50">
                    <tr>
                        <th v-for="col in columns" :key="col.key"
                            class="px-6 py-3.5 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider"
                            :class="col.className">
                            {{ col.label }}
                        </th>
                        <th v-if="$slots.actions"
                            class="px-6 py-3.5 text-right text-xs font-semibold text-dark-400 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-dark-700/30">
                    <tr v-for="(row, idx) in data" :key="(row.id as string) || String(idx)"
                        class="hover:bg-dark-750/50 transition-colors duration-150">
                        <td v-for="col in columns" :key="col.key" class="px-6 py-4 whitespace-nowrap text-sm"
                            :class="col.className">
                            <slot :name="`cell-${col.key}`" :row="row" :value="getNestedValue(row, col.key)">
                                <span class="text-dark-300">{{ getNestedValue(row, col.key) }}</span>
                            </slot>
                        </td>
                        <td v-if="$slots.actions" class="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <slot name="actions" :row="row" />
                        </td>
                    </tr>
                    <tr v-if="!data.length">
                        <td :colspan="columns.length + (!!$slots.actions ? 1 : 0)" class="px-6 py-16 text-center">
                            <div class="flex flex-col items-center gap-2">
                                <span class="text-3xl opacity-30">📭</span>
                                <p class="text-sm text-dark-500">No data found</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="$slots.footer" class="border-t border-dark-700/50 px-6 py-4 bg-dark-850/30">
            <slot name="footer" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

interface Column {
    key: string;
    label: string;
    className?: string;
}

defineProps({
    columns: {
        type: Array as PropType<Column[]>,
        required: true,
    },
    data: {
        type: Array as PropType<Record<string, unknown>[]>,
        default: () => [],
    },
    primaryKey: {
        type: String,
        default: 'id',
    },
});

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce((acc: unknown, part: string) => {
        if (acc && typeof acc === 'object') {
            return (acc as Record<string, unknown>)[part];
        }
        return undefined;
    }, obj);
}
</script>
