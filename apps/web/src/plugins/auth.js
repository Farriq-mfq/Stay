import { createAuth } from '@websanova/vue-auth/src/v3.js';
import driverHttpAxios from '@websanova/vue-auth/src/drivers/http/axios.1.x.js';
import driverRouterVueRouter from '@websanova/vue-auth/src/drivers/router/vue-router.2.x.js';
import { config } from '../config';

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
                    const parseToken = JSON.parse(token)
                    if (parseToken && parseToken.accessToken && parseToken.refreshToken) {
                        if (req.url === '/auth/refresh') {
                            this.drivers.http.setHeaders(req, { Authorization: 'Bearer ' + parseToken.refreshToken })
                        } else {
                            this.drivers.http.setHeaders(req, { Authorization: 'Bearer ' + parseToken.accessToken })
                        }
                    }

                },
                response: function (res) {
                    if ('data' in res.data) {
                        const { accessToken, refreshToken } = res.data.data
                        if (accessToken && refreshToken) return JSON.stringify({
                            accessToken,
                            refreshToken
                        });
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
            stores: ['storage'],
            tokenDefaultKey: config.token_key,
            rolesKey: 'role',
            permissionsKey: "permissions",
            notFoundRedirect: { name: 'not-found' },
        },
    }));
}