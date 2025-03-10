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
        path: '/transactions',
        name: 'transactions',
        component: () => import('@/views/pegawai/Transactions/Index.vue'),
        meta: {
            layout: 'PegawaiMainLayout',
            auth: true
        }
    },
    {
        path: '/transactions/topup',
        name: 'transactions-topup',
        component: () => import('@/views/pegawai/Transactions/Topup.vue'),
        meta: {
            layout: 'PegawaiMainLayout',
            auth: true
        }
    },
    {
        path: '/transactions/transfer',
        name: 'transactions-transfer',
        component: () => import('@/views/pegawai/Transactions/Transfer.vue'),
        meta: {
            layout: 'PegawaiMainLayout',
            auth: true
        }
    },
    {
        path: '/transactions/withdraw',
        name: 'transactions-withdraw',
        component: () => import('@/views/pegawai/Transactions/Withdraw.vue'),
        meta: {
            layout: 'PegawaiMainLayout',
            auth: true
        }
    },
    {
        path: '/transactions/:transaction_id/detail',
        name: 'transactions-detail',
        component: () => import('@/views/pegawai/Transactions/Detail.vue'),
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