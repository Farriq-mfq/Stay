import driverHttpAxios from '@websanova/vue-auth/src/drivers/http/axios.1.x';
import driverRouterVueRouter from '@websanova/vue-auth/src/drivers/router/vue-router.2.x.js';
import { createAuth } from '@websanova/vue-auth/src/v3.js';
import { config } from '../config';
import { ROLES } from '../routes/middleware/role-selected';




export default (app) => {

    const role = localStorage.getItem(`${config.STORAGE_KEY}/role`);
    const checkRole = role && ROLES.includes(role);

    app.use(checkRole && role === "SISWA" ? createAuth({
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
                        if (req.url === '/siswa/auth/refresh') {
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
                url: '/siswa/auth/login',
                method: 'POST',
                fetchUser: false,
            },
            logoutData: {
                url: '/siswa/auth/logout',
                method: 'POST',
                makeRequest: true,
            },
            fetchData: {
                url: '/siswa/auth/me',
                method: 'GET',
                enabled: true,
            },
            refreshData: {
                url: '/siswa/auth/refresh',
                method: 'POST',
                enabled: true,
            },
            stores: ['storage'],
            tokenDefaultKey: config.STORAGE_KEY,
            rolesKey: 'role',
            notFoundRedirect: { name: 'not-found' },
        },
    }) : checkRole && role === "PEGAWAI" ? createAuth({
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
                        if (req.url === '/pegawai/auth/refresh') {
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
                url: '/pegawai/auth/login',
                method: 'POST',
                fetchUser: false,
            },
            logoutData: {
                url: '/pegawai/auth/logout',
                method: 'POST',
                makeRequest: true,
            },
            fetchData: {
                url: '/pegawai/auth/me',
                method: 'GET',
                enabled: true,
            },
            refreshData: {
                url: '/pegawai/auth/refresh',
                method: 'POST',
                enabled: true,
            },
            stores: ['storage'],
            tokenDefaultKey: config.STORAGE_KEY,
            rolesKey: 'role',
            notFoundRedirect: { name: 'not-found' },
        },
    }) : null);

}