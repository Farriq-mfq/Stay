import { VueQueryPlugin } from '@tanstack/vue-query';
import { createApp, inject } from 'vue';
import vueDebounce from 'vue-debounce';
import App from './App.vue';
import auth from './plugins/auth';
import http from './plugins/http';
import queryClient from './plugins/query-client';
import socket from './plugins/socket';
import router from './router';

import VueQrcode from '@chenfengyuan/vue-qrcode';
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


import '@/assets/styles.scss';

const app = createApp(App);

app.provide("APP_NAME", import.meta.env.VITE_APP_NAME);

app.config.globalProperties.$can = (permission) => {
    const auth = inject('auth');
    const permissions = auth.user().permissions;
    return permissions.includes(permission);
};

app.use(http);
app.use(router);
app.use(auth);
app.use(queryClient);
app.use(socket);
app.directive('debounce', vueDebounce({ lock: true }))
app.use(PrimeVue, { ripple: true });
app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);
app.component(VueQrcode.name, VueQrcode);
app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);

app.component('ConfirmDialog', ConfirmDialog);
app.component('ConfirmPopup', ConfirmPopup);
app.component('Toast', Toast);

app.use(VueQueryPlugin)

app.mount('#app');
