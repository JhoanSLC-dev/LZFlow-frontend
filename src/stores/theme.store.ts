import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
    const isDark = ref(true);

    function init() {
        const saved = localStorage.getItem('lzflow-theme');
        if (saved === 'light' || saved === 'dark') {
            isDark.value = saved === 'dark';
        } else {
            isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        applyTheme(false);
    }

    function applyTheme(animate = true) {
        const html = document.documentElement;
        if (animate) html.classList.add('theme-transitioning');
        if (isDark.value) {
            html.classList.remove('light');
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
            html.classList.add('light');
        }
        localStorage.setItem('lzflow-theme', isDark.value ? 'dark' : 'light');
        if (animate) {
            setTimeout(() => html.classList.remove('theme-transitioning'), 400);
        }
    }

    function toggle() {
        isDark.value = !isDark.value;
        applyTheme(true);
    }

    init();

    return { isDark, toggle, init };
});
