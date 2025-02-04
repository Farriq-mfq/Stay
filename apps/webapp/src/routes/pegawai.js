import { createRouter, createWebHistory } from 'vue-router'
import { loadLayoutMiddleware } from './middleware/loadLayoutMiddleware'


/**
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: () => import('@/views/pegawai/dashboard/Dashboard.vue'),
        meta: {
            layout: 'PegawaiMainLayout'
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import("@/views/pegawai/Auth/Login.vue"),
        meta: {
            layout: 'AuthLayout'
        }
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(loadLayoutMiddleware)

export default router