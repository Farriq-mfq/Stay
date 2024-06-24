import { createAuth } from '@websanova/vue-auth/src/v3.js';
import driverHttpAxios from '@websanova/vue-auth/src/drivers/http/axios.1.x.js';
import driverRouterVueRouter from '@websanova/vue-auth/src/drivers/router/vue-router.2.x.js';

export default (app) => {
    app.use(createAuth({
        plugins: {
            http: app.axios,
            router: app.router,
        },
        drivers: {
            http: driverHttpAxios,
            auth: {
                request: function (req, token) {
                    this.drivers.http.setHeaders(req, { Authorization: 'Bearer ' + token })
                },
                response: function (res) {
                    if ('data' in res.data) {
                        return res.data.data.accessToken;
                    }
                },
            },
            router: driverRouterVueRouter,
        },
        options: {
            authRedirect: '/login',
            loginData: {
                url: '/auth/login',
                method: 'POST',
                fetchUser: false,
            },
            logoutData: {
                url: '/auth/logout',
                method: 'POST',
                makeRequest: true,
            },
            fetchData: {
                url: '/auth/me',
                method: 'GET',
                enabled: true,
            },
            refreshData: {
                url: '/auth/refresh',
                method: 'POST',
                enabled: true,
            },
            stores: ['cookie', 'storage'],
            tokenDefaultKey: "@stay/token",
            rolesKey: 'role',
            notFoundRedirect: { name: 'not-found' },
        },
    }));
}