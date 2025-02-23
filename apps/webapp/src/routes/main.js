import { createRouter, createWebHistory } from 'vue-router'
import { loadLayoutMiddleware } from './middleware/loadLayoutMiddleware'
import { checkRoleSelectedMiddleware, ROLES } from './middleware/role-selected'
import { config } from '../config';
import { pegawaiRouter, siswaRouter } from '.';

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

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(loadLayoutMiddleware)

export default router