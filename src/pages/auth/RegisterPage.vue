<template>
    <div>
        <h2 class="text-xl font-bold text-dark-50 mb-6">{{ locale.t('auth.register') }}</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
            <FormField name="organizationName" :label="locale.t('auth.organization')" v-model="form.organizationName"
                :placeholder="locale.t('auth.orgPlaceholder')" :error="errors.organizationName" />
            <FormField name="name" :label="locale.t('auth.name')" v-model="form.name" :placeholder="locale.t('auth.namePlaceholder')" :error="errors.name" />
            <FormField name="email" :label="locale.t('auth.email')" type="email" v-model="form.email" :placeholder="locale.t('auth.emailPlaceholder')"
                :error="errors.email" />
            <FormField name="password" :label="locale.t('auth.password')" type="password" v-model="form.password"
                :placeholder="locale.t('auth.passwordMinPlaceholder')" :error="errors.password" />
            <button type="submit" :disabled="loading" class="btn-primary w-full">
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {{ loading ? locale.t('auth.creatingAccount') : locale.t('auth.createAccount') }}
            </button>
            <p v-if="apiError"
                class="text-sm text-red-400 text-center bg-red-500/10 rounded-lg p-3 border border-red-500/20">{{
                apiError }}</p>
            <p class="text-sm text-dark-400 text-center">
                {{ locale.t('auth.hasAccount') }}
                <router-link to="/login" class="link font-medium">{{ locale.t('auth.signInButton') }}</router-link>
            </p>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';
import FormField from '../../components/ui/FormField.vue';
import { useLocaleStore } from '../../stores/locale.store';

const locale = useLocaleStore();

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const apiError = ref('');

const form = reactive({ organizationName: '', name: '', email: '', password: '' });
const errors = reactive({ organizationName: '', name: '', email: '', password: '' });

async function handleSubmit() {
    apiError.value = '';
    Object.keys(errors).forEach((k) => (errors[k as keyof typeof errors] = ''));
    let hasError = false;
    if (!form.organizationName) { errors.organizationName = locale.t('auth.orgRequired'); hasError = true; }
    if (!form.name) { errors.name = locale.t('auth.nameRequired'); hasError = true; }
    if (!form.email) { errors.email = locale.t('auth.emailRequiredReg'); hasError = true; }
    if (!form.password || form.password.length < 8) { errors.password = locale.t('auth.passwordMinChars'); hasError = true; }
    if (hasError) return;

    loading.value = true;
    try {
        await authStore.register({ ...form });
        router.push('/dashboard');
    } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string } } };
        apiError.value = error?.response?.data?.error || locale.t('auth.registrationFailed');
    } finally {
        loading.value = false;
    }
}
</script>
