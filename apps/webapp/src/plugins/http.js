import axios from 'axios';
import { config } from '../config';

axios.defaults.baseURL = `${config.backend_ssl ? 'https' : 'http'}://${config.backend_host}`;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.timeout = 10000
axios.defaults.withCredentials = true;


export default {
    install: (app) => {
        app.axios = axios;
        app.$http = axios;

        app.config.globalProperties.axios = axios;
        app.config.globalProperties.$http = axios;
    }
}