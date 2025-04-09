import { createPinia } from 'pinia';
import BadgeDirective from 'primevue/badgedirective';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmPopup from 'primevue/confirmpopup';
import DialogService from 'primevue/dialogservice';
import Ripple from 'primevue/ripple';
import StyleClass from 'primevue/styleclass';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './routes';
import { VueQueryPlugin } from '@tanstack/vue-query';

import '@/assets/style.css';
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';
import "driver.js/dist/driver.css";

import auth from './plugins/auth';
import http from './plugins/http';



const app = createApp(App);
const pinia = createPinia()

// app.config.globalProperties.$driver = driver; // planning to use driver.js

app.use(PrimeVue, { ripple: true });
app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);
app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);
app.component('ConfirmDialog', ConfirmDialog);
app.component('ConfirmPopup', ConfirmPopup);
app.component('Toast', Toast);
app.use(http);
app.use(router)
app.use(auth);
app.use(pinia)
app.use(VueQueryPlugin)
app.mount('#app');


// check if production
const isProduction = import.meta.env.PROD;
// clear all console.log if production, but preserve error messages
if (isProduction) {
    const originalConsoleLog = console.log;
    console.log = () => { };
    
    // Ensure error messages are still shown
    if (!console.error) {
        console.error = originalConsoleLog;
    }
}

