<template>
    <TransitionRoot appear :show="modelValue" as="template">
        <Dialog as="div" @close="close" class="relative z-50">
            <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4">
                    <TransitionChild as="template" enter="duration-200 ease-out"
                        enter-from="opacity-0 scale-95 translate-y-2" enter-to="opacity-100 scale-100 translate-y-0"
                        leave="duration-150 ease-in" leave-from="opacity-100 scale-100 translate-y-0"
                        leave-to="opacity-0 scale-95 translate-y-2">
                        <DialogPanel
                            class="w-full max-w-md bg-dark-800 rounded-2xl border border-dark-700/50 shadow-2xl shadow-black/40 p-6">
                            <DialogTitle v-if="title" class="text-lg font-semibold text-dark-50 mb-4">
                                {{ title }}
                            </DialogTitle>
                            <slot />
                            <div v-if="$slots.actions" class="mt-6 flex justify-end gap-3">
                                <slot name="actions" />
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';

defineProps({
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);
function close() {
    emit('update:modelValue', false);
}
</script>
