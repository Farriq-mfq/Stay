
/**
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: () => import('@/views/siswa/dashboard/Dashboard.vue'),
        meta: {
            layout: 'SiswaMainLayout',
            auth: true
        }
    },
    {
        path: '/transactions',
        name: 'transactions',
        component: () => import('@/views/siswa/Transactions/Index.vue'),
        meta: {
            layout: 'SiswaMainLayout',
            auth: true
        }
    },
    {
        path: '/transactions/topup',
        name: 'transactions-topup',
        component: () => import('@/views/siswa/Transactions/Topup.vue'),
        meta: {
            layout: 'SiswaMainLayout',
            auth: true
        }
    },
    {
        path: '/transactions/transfer',
        name: 'transactions-transfer',
        component: () => import('@/views/siswa/Transactions/Transfer.vue'),
        meta: {
            layout: 'SiswaMainLayout',
            auth: true
        }
    },
    {
        path: '/transactions/withdraw',
        name: 'transactions-withdraw',
        component: () => import('@/views/siswa/Transactions/Withdraw.vue'),
        meta: {
            layout: 'SiswaMainLayout',
            auth: true
        }
    },
    {
        path: '/transactions/:transaction_id/detail',
        name: 'transactions-detail',
        component: () => import('@/views/siswa/Transactions/Detail.vue'),
        meta: {
            layout: 'SiswaMainLayout',
            auth: true
        }
    },
    {
        path: "/presences",
        name: 'presences',
        component: () => import('@/views/siswa/Presences/Index.vue'),
        meta: {
            layout: 'SiswaMainLayout',
            auth: true
        }
    },
    {
        path: "/presences/:id/detail",
        name: 'presences-detail',
        component: () => import('@/views/siswa/Presences/Detail.vue'),
        meta: {
            layout: 'SiswaMainLayout',
            auth: true
        }
    },
    {
        path: "/setting",
        name: 'setting',
        component: () => import('@/views/siswa/Setting/Index.vue'),
        meta: {
            layout: 'SiswaMainLayout',
            auth: true
        },
    },
    {
        path: "/account",
        name: "setting-account",
        component: () => import("@/views/siswa/Setting/Account.vue"),
        meta: {
            layout: 'SiswaMainLayout',
            auth: true
        }
    },
    {
        path: "/security",
        name: "setting-security",
        component: () => import("@/views/siswa/Setting/Security.vue"),
        meta: {
            layout: 'SiswaMainLayout',
            auth: true
        }
    },
    {
        path: "/about",
        name: "about",
        component: () => import("@/views/Common/About.vue"),
        meta: {
            layout: 'SiswaMainLayout',
            auth: true
        }
    },
    {
        path: "/contact",
        name: "contact",
        component: () => import("@/views/Common/Contact.vue"),
        meta: {
            layout: 'SiswaMainLayout',
            auth: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/siswa/Auth/Login.vue'),
        meta: {
            layout: 'AuthLayout',
            auth: false,
        }
    },

    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/siswa/auth/Login.vue'),
        meta: {
            layout: 'AuthLayoutSiswa',
            auth: false
        }
    },

    {
        path: '/:pathNotFound(.*)*',
        name: 'not-found',
        component: () => import('@/views/Errors/NotFound.vue'),
        meta: {
            layout: 'SiswaMainLayout',
        }
    },
    {
        path: '/unavailable',
        name: 'unavailable',
        component: () => import('@/views/Errors/Unvailable.vue'),
        meta: {
            layout: 'SiswaMainLayout',
        }
    }
]

export default routes;