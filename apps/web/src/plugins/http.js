import axios from 'axios';

axios.defaults.baseURL = `http://localhost:3000`;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.timeout = 10000

export default (app) => {
    app.axios = axios;
    app.$http = axios;

    app.config.globalProperties.axios = axios;
    app.config.globalProperties.$http = axios;
}