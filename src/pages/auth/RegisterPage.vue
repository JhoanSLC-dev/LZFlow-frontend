<template>
    <div>
        <h2 class="text-xl font-bold text-dark-50 mb-6">{{ locale.t('auth.register') }}</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
            <FormField name="organizationName" label="Organization Name" v-model="form.organizationName"
                placeholder="Your Company Inc." :error="errors.organizationName" />
            <FormField name="name" label="Your Name" v-model="form.name" placeholder="John Doe" :error="errors.name" />
            <FormField name="email" label="Email" type="email" v-model="form.email" placeholder="you@company.com"
                :error="errors.email" />
            <FormField name="password" label="Password" type="password" v-model="form.password"
                placeholder="At least 8 characters" :error="errors.password" />
            <button type="submit" :disabled="loading" class="btn-primary w-full">
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {{ loading ? 'Creating account...' : 'Create account' }}
            </button>
            <p v-if="apiError"
                class="text-sm text-red-400 text-center bg-red-500/10 rounded-lg p-3 border border-red-500/20">{{
                apiError }}</p>
            <p class="text-sm text-dark-400 text-center">
                Already have an account?
                <router-link to="/login" class="link font-medium">Sign in</router-link>
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
    if (!form.organizationName) { errors.organizationName = 'Required'; hasError = true; }
    if (!form.name) { errors.name = 'Required'; hasError = true; }
    if (!form.email) { errors.email = 'Required'; hasError = true; }
    if (!form.password || form.password.length < 8) { errors.password = 'At least 8 characters'; hasError = true; }
    if (hasError) return;

    loading.value = true;
    try {
        await authStore.register({ ...form });
        router.push('/dashboard');
    } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string } } };
        apiError.value = error?.response?.data?.error || 'Registration failed';
    } finally {
        loading.value = false;
    }
}
</script>
