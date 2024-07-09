import './assets/main.scss';


import PrimeVue from 'primevue/config';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import http from './plugins/http';
import auth from './plugins/auth';

const app = createApp(App)

app.use(router)
app.use(http)
app.use(auth)
app.use(PrimeVue, {
    ripple: true, theme: {
        preset: Aura
    }
});
app.use(ToastService);
app.use(ConfirmationService);
app.mount('#app')


// pwa register
import { pwaInfo } from 'virtual:pwa-info'
import { registerSW } from 'virtual:pwa-register'

console.log(pwaInfo)


registerSW({
    immediate: true,
    onNeedRefresh() {
        console.log('onNeedRefresh message should not appear')
    },
    onOfflineReady() {
        console.log('onOfflineReady message should not appear')
    },
})