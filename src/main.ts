import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

import { useThemeStore } from './stores/theme.store';
const themeStore = useThemeStore(pinia);
themeStore.init();

app.mount('#app');
