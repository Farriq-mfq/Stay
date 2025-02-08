import { createApp } from 'vue';
import App from './App.vue';
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
import { createPinia } from 'pinia'
import { pegawaiRouter } from './routes';

import '@/assets/style.css';
import '/node_modules/primeflex/primeflex.css';
import 'primeicons/primeicons.css'



const app = createApp(App);
const pinia = createPinia()
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
app.use(pinia)

app.use(pegawaiRouter)


app.mount('#app');
