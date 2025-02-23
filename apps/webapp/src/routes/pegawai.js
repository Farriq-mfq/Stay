import Login from "@/views/pegawai/Auth/Login.vue"

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
        path: '/payment/withdraw',
        name: 'payment-withdraw',
        component: () => import('@/views/pegawai/Payment/Withdraw.vue'),
        meta: {
            layout: 'PegawaiMainLayout'
        }
    },
    {
        path: '/payment/:transaction_id/detail',
        name: 'payment-detail',
        component: () => import('@/views/pegawai/Payment/Detail.vue'),
        meta: {
            layout: 'PegawaiMainLayout'
        }
    },
    {
        path: "/presences",
        name: 'presences',
        component: () => import('@/views/pegawai/Presences/Index.vue'),
        meta: {
            layout: 'PegawaiMainLayout'
        }
    },
    {
        path: "/presences/:id/detail",
        name: 'presences-detail',
        component: () => import('@/views/pegawai/Presences/Detail.vue'),
        meta: {
            layout: 'PegawaiMainLayout'
        }
    },
    {
        path: "/setting",
        name: 'setting',
        component: () => import('@/views/pegawai/Setting/Index.vue'),
        meta: {
            layout: 'PegawaiMainLayout'
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            layout: 'AuthLayout'
        }
    }
]

export default routes;