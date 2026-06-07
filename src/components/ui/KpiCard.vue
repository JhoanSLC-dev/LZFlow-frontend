<template>
    <div class="card p-5 hover:border-lz-500/20 transition-all duration-200 group">
        <div class="flex items-start justify-between">
            <div class="space-y-1">
                <p class="text-sm font-medium text-dark-400">{{ title }}</p>
                <p class="kpi-value">
                    <span v-if="prefix" class="text-dark-400 mr-1">{{ prefix }}</span>
                    {{ formattedValue }}
                </p>
                <p v-if="subtitle" class="text-xs text-dark-500">{{ subtitle }}</p>
            </div>
            <div v-if="icon" class="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">
                {{ icon }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    title: { type: String, required: true },
    value: { type: [Number, String], default: 0 },
    prefix: { type: String, default: '' },
    format: { type: String, default: 'number' },
    icon: { type: String, default: '' },
    subtitle: { type: String, default: '' },
});

const formattedValue = computed(() => {
    if (props.format === 'currency') {
        return Number(props.value).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    }
    return Number(props.value).toLocaleString();
});
</script>
