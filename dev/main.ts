import { createApp } from 'vue';
import App from './App.vue';
import '@tailwindcss/postcss7-compat/dist/base.css';
import '@tailwindcss/postcss7-compat/dist/components.css';
import '@tailwindcss/postcss7-compat/dist/utilities.css';
const app = createApp(App);
app.mount('#app');
