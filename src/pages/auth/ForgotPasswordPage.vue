<template>
    <div>
        <h2 class="text-xl font-bold text-dark-50 mb-6">{{ locale.t('auth.forgotPassword') }}</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
            <p class="text-sm text-dark-400 mb-4">{{ locale.t('auth.resetInstructions') }}</p>
            <FormField name="email" :label="locale.t('auth.email')" type="email" v-model="email" :placeholder="locale.t('auth.emailPlaceholder')"
                :error="error" />
            <button type="submit" :disabled="loading" class="btn-primary w-full">
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {{ loading ? locale.t('auth.sending') : locale.t('auth.sendReset') }}
            </button>
            <p v-if="message"
                class="text-sm text-emerald-400 text-center bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                {{ message }}</p>
            <p v-if="apiError"
                class="text-sm text-red-400 text-center bg-red-500/10 rounded-lg p-3 border border-red-500/20">{{
                apiError }}</p>
            <p class="text-sm text-dark-400 text-center">
                <router-link to="/login" class="link font-medium">{{ locale.t('auth.backToLogin') }}</router-link>
            </p>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { authService } from '../../services/auth.service';
import FormField from '../../components/ui/FormField.vue';
import { useLocaleStore } from '../../stores/locale.store';

const locale = useLocaleStore();

const email = ref('');
const error = ref('');
const loading = ref(false);
const apiError = ref('');
const message = ref('');

async function handleSubmit() {
    error.value = '';
    apiError.value = '';
    message.value = '';
    if (!email.value) { error.value = locale.t('auth.emailRequired'); return; }
    loading.value = true;
    try {
        await authService.forgotPassword(email.value);
        message.value = locale.t('auth.resetSent');
    } catch {
        apiError.value = locale.t('auth.sendFailed');
    } finally {
        loading.value = false;
    }
}
</script>
