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
        path: '/payment',
        name: 'payment',
        component: () => import('@/views/pegawai/Payment/Index.vue'),
        meta: {
            layout: 'PegawaiMainLayout'
        }
    },
    {
        path: '/payment/topup',
        name: 'payment-topup',
        component: () => import('@/views/pegawai/Payment/Topup.vue'),
        meta: {
            layout: 'PegawaiMainLayout'
        }
    },
    {
        path: '/payment/transfer',
        name: 'payment-transfer',
        component: () => import('@/views/pegawai/Payment/Transfer.vue'),
        meta: {
            layout: 'PegawaiMainLayout'
        }
    },
    {
        path: '/payment/:transaction_id',
        name: 'payment-detail',
        component: () => import('@/views/pegawai/Payment/Detail.vue'),
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