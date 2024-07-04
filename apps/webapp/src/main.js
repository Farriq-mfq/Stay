import './assets/main.scss';


import PrimeVue from 'primevue/config';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
// import VueQrcodeReader from 'vue-qrcode-reader'

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
    ripple: true, theme: {
        preset: Aura
    }
});
app.use(ToastService);
// app.user(VueQrcodeReader)
app.mount('#app')
