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
            layout: 'PegawaiMainLayout',
            auth: true
        }
    },
    {
        path: '/payment',
        name: 'payment',
        component: () => import('@/views/pegawai/Payment/Index.vue'),
        meta: {
            layout: 'PegawaiMainLayout',
            auth: true
        }
    },
    {
        path: '/payment/topup',
        name: 'payment-topup',
        component: () => import('@/views/pegawai/Payment/Topup.vue'),
        meta: {
            layout: 'PegawaiMainLayout',
            auth: true
        }
    },
    {
        path: '/payment/transfer',
        name: 'payment-transfer',
        component: () => import('@/views/pegawai/Payment/Transfer.vue'),
        meta: {
            layout: 'PegawaiMainLayout',
            auth: true
        }
    },
    {
        path: '/payment/withdraw',
        name: 'payment-withdraw',
        component: () => import('@/views/pegawai/Payment/Withdraw.vue'),
        meta: {
            layout: 'PegawaiMainLayout',
            auth: true
        }
    },
    {
        path: '/payment/:transaction_id/detail',
        name: 'payment-detail',
        component: () => import('@/views/pegawai/Payment/Detail.vue'),
        meta: {
            layout: 'PegawaiMainLayout',
            auth: true
        }
    },
    {
        path: "/presences",
        name: 'presences',
        component: () => import('@/views/pegawai/Presences/Index.vue'),
        meta: {
            layout: 'PegawaiMainLayout',
            auth: true
        }
    },
    {
        path: "/presences/:id/detail",
        name: 'presences-detail',
        component: () => import('@/views/pegawai/Presences/Detail.vue'),
        meta: {
            layout: 'PegawaiMainLayout',
            auth: true
        }
    },
    {
        path: "/setting",
        name: 'setting',
        component: () => import('@/views/pegawai/Setting/Index.vue'),
        meta: {
            layout: 'PegawaiMainLayout',
            auth: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            layout: 'AuthLayout',
            auth: false,
        }
    },
    {
        path: '/:pathNotFound(.*)*',
        name: 'not-found',
        component: () => import('@/views/Errors/NotFound.vue'),
        meta: {
            title: "404"
        }
    },
]

export default routes;