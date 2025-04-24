import Login from "@/views/pegawai/Auth/Login.vue";

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
        path: "/feature/presence",
        name: "feature-presence",
        component: () => import("@/views/pegawai/Feature/Presence.vue"),
        meta: {
            layout: "PegawaiMainLayout",
            auth: true,
        },
    },
    {
        path: "/feature/leave",
        meta: {
            layout: "PegawaiMainLayout",
            auth: true,
        },
        component: () => import("@/views/pegawai/Feature/Leave/Index.vue"),
        children: [
            {
                name: "feature-leave",
                path: '',
                component: () => import("@/views/pegawai/Feature/Leave/List.vue"),
            },
            {
                name: "feature-leave-detail",
                path: ":id/detail",
                component: () => import("@/views/pegawai/Feature/Leave/Detail.vue"),
            }
        ],
    },
    {
        path: "/feature/journal-activity",
        meta: {
            layout: "PegawaiMainLayout",
            auth: true,
        },
        component: () => import("@/views/pegawai/Feature/Activity/Index.vue"),
        children: [
            {
                name: "feature-journal-activity",
                path: '',
                component: () => import("@/views/pegawai/Feature/Activity/List.vue"),
            },
            {
                name: "feature-journal-activity-detail",
                path: ":id/detail",
                component: () => import("@/views/pegawai/Feature/Activity/Detail.vue"),
            }
        ],
    },
    {
        path: '/notification',
        name: 'notification',
        component: () => import("@/views/pegawai/Notification/Index.vue"),
        meta: {
            layout: 'PegawaiMainLayout',
            auth: true,
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

    },
    {
        path: '/unavailable',
        name: 'unavailable',
        component: () => import('@/views/Errors/Unavailable.vue'),
    }
]

export default routes;