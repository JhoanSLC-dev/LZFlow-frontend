import { Locale, messages } from '../i18n';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLocaleStore = defineStore('locale', () => {
    const locale = ref<Locale>((localStorage.getItem('lzflow-locale') as Locale) || 'en');

    function setLocale(l: Locale) {
        locale.value = l;
        localStorage.setItem('lzflow-locale', l);
        document.documentElement.lang = l;
    }

    function t(key: string, params?: Record<string, string | number>): string {
        const keys = key.split('.');
        let value: any = messages[locale.value];
        for (const k of keys) {
            value = value?.[k];
        }
        if (typeof value !== 'string') return key;
        if (params) {
            return value.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
        }
        return value;
    }

    document.documentElement.lang = locale.value;

    return { locale, setLocale, t };
});
