<template>
    <div>
        <h2 class="text-xl font-bold text-dark-50 mb-6">{{ locale.t('auth.signIn') }}</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
            <FormField name="email" :label="locale.t('auth.email')" type="email" v-model="form.email" :placeholder="locale.t('auth.emailPlaceholder')"
                :error="errors.email" />
            <FormField name="password" :label="locale.t('auth.password')" type="password" v-model="form.password"
                :placeholder="locale.t('auth.passwordPlaceholder')" :error="errors.password" />
            <div class="flex items-center justify-end">
                <router-link to="/forgot-password" class="text-sm link">
                    {{ locale.t('auth.forgotPassword') }}
                </router-link>
            </div>
            <button type="submit" :disabled="loading" class="btn-primary w-full">
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {{ loading ? locale.t('auth.signingIn') : locale.t('auth.signInButton') }}
            </button>
            <p v-if="apiError"
                class="text-sm text-red-400 text-center bg-red-500/10 rounded-lg p-3 border border-red-500/20">{{
                apiError }}</p>
            <p class="text-sm text-dark-400 text-center">
                {{ locale.t('auth.noAccount') }}
                <router-link to="/register" class="link font-medium">{{ locale.t('auth.createOne') }}</router-link>
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

const form = reactive({ email: '', password: '' });
const errors = reactive({ email: '', password: '' });

async function handleSubmit() {
    apiError.value = '';
    errors.email = '';
    errors.password = '';
    let hasError = false;
    if (!form.email) { errors.email = locale.t('auth.emailRequired'); hasError = true; }
    if (!form.password) { errors.password = locale.t('auth.passwordRequired'); hasError = true; }
    if (hasError) return;

    loading.value = true;
    try {
        await authStore.login(form.email, form.password);
        router.push('/dashboard');
    } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string } } };
        apiError.value = error?.response?.data?.error || locale.t('auth.loginFailed');
    } finally {
        loading.value = false;
    }
}
</script>
