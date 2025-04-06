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
        path: "/account",
        name: "setting-account",
        component: () => import("@/views/pegawai/Setting/Account.vue"),
        meta: {
            layout: 'PegawaiMainLayout',
            auth: true
        }
    },
    {
        path: "/security",
        name: "setting-security",
        component: () => import("@/views/pegawai/Setting/Security.vue"),
        meta: {
            layout: 'PegawaiMainLayout',
            auth: true
        }
    },
    {
        path: "/about",
        name: "about",
        component: () => import("@/views/Common/About.vue"),
        meta: {
            layout: 'PegawaiMainLayout',
            auth: true
        }
    },
    {
        path: "/contact",
        name: "contact",
        component: () => import("@/views/Common/Contact.vue"),
        meta: {
            layout: 'PegawaiMainLayout',
            auth: true
        }
    },
    {
        path: "/theme",
        name: "theme",
        component: () => import("@/views/pegawai/Setting/Theme.vue"),
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
    {
        path: '/unavailable',
        name: 'unavailable',
        component: () => import('@/views/Errors/Unvailable.vue'),
        meta: {
            layout: 'PegawaiMainLayout',
        }
    }
]

export default routes;