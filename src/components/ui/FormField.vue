<template>
    <div class="mb-4">
        <label v-if="label" :for="name" class="label">{{ label }}</label>
        <input v-if="type === 'text' || type === 'email' || type === 'password' || type === 'number'" :id="name"
            :type="type" :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" :placeholder="placeholder"
            :disabled="disabled" class="input" :class="{ 'input-error': error }" />
        <select v-else-if="type === 'select'" :id="name" :value="modelValue"
            @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)" :disabled="disabled"
            class="input appearance-none" :class="{ 'input-error': error }">
            <option value="" disabled class="bg-dark-800">Select...</option>
            <option v-for="opt in options" :key="opt.value" :value="opt.value" class="bg-dark-800">
                {{ opt.label }}
            </option>
        </select>
        <textarea v-else-if="type === 'textarea'" :id="name" :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)" :placeholder="placeholder"
            :disabled="disabled" rows="3" class="input" :class="{ 'input-error': error }" />
        <p v-if="error" class="mt-1.5 text-sm text-red-400">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
interface SelectOption {
    value: string;
    label: string;
}

defineProps({
    name: { type: String, required: true },
    label: { type: String, default: '' },
    type: { type: String, default: 'text' },
    modelValue: { type: [String, Number], default: '' },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    error: { type: String, default: '' },
    options: { type: Array as () => SelectOption[], default: () => [] },
});

defineEmits(['update:modelValue']);
</script>
