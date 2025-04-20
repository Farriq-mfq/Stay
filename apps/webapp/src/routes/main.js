import { createRouter, createWebHistory } from 'vue-router';
import { pegawaiRouter, siswaRouter } from '.';
import { config } from '../config';
import { loadLayoutMiddleware } from './middleware/loadLayoutMiddleware';
import { ROLES } from './middleware/role-selected';

const role = localStorage.getItem(`${config.STORAGE_KEY}/role`);


/**
 * @type {import('vue-router').RouteRecordRaw[]}
 */
let routes = []

const checkRole = role && ROLES.includes(role);

if (checkRole && role === "PEGAWAI") {
    routes = pegawaiRouter
} else if (checkRole && role === "SISWA") {
    routes = siswaRouter
} else {
    routes = [
        {
            path: '/role',
            name: 'role',
            component: () => import('@/views/main/SelectRole.vue'),
            meta: {
                layout: 'SelectRoleLayout'
            }
        },
        {
            path: '/:pathMatch(.*)',
            name: 'dashboard',
            redirect: {
                name: 'role'
            }
        }
    ]
}





export default (app) => {

    const router = createRouter({
        history: createWebHistory(),
        routes
    })

    router.beforeEach(loadLayoutMiddleware)
    app.router = router
    app.config.globalProperties.$router = router;

    app.use(router)
}