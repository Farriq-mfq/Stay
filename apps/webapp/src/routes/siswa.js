
/**
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: () => import('@/views/siswa/dashboard/Dashboard.vue'),
        meta: {
            layout: 'SiswaMainLayout'
        }
    },
    {
        path: '/payment',
        name: 'payment',
        component: () => "<h1>Lorem ipsum dolor sit amet</h1>",
        meta: {
            layout: 'SiswaMainLayput'
        }
    },
    {
        path: '/payment/topup',
        name: 'payment-topup',
        component: () => "<h1>Lorem ipsum dolor sit amet</h1>",
        meta: {
            layout: 'SiswaMainLayput'
        }
    },
    {
        path: '/payment/transfer',
        name: 'payment-transfer',
        component: () => "<h1>Lorem ipsum dolor sit amet</h1>",
        meta: {
            layout: 'SiswaMainLayput'
        }
    },
    {
        path: '/payment/withdraw',
        name: 'payment-withdraw',
        component: () => "<h1>Lorem ipsum dolor sit amet</h1>",
        meta: {
            layout: 'SiswaMainLayput'
        }
    },
    {
        path: '/payment/:transaction_id/detail',
        name: 'payment-detail',
        component: () => "<h1>Lorem ipsum dolor sit amet</h1>",
        meta: {
            layout: 'SiswaMainLayput'
        }
    },
    {
        path: "/presences",
        name: 'presences',
        component: () => "<h1>Lorem ipsum dolor sit amet</h1>",
        meta: {
            layout: 'SiswaMainLayput'
        }
    },
    {
        path: "/presences/:id/detail",
        name: 'presences-detail',
        component: () => "<h1>Lorem ipsum dolor sit amet</h1>",
        meta: {
            layout: 'SiswaMainLayput'
        }
    },
    {
        path: "/setting",
        name: 'setting',
        component: () => "<h1>Lorem ipsum dolor sit amet</h1>",
        meta: {
            layout: 'SiswaMainLayput'
        }
    },
]

export default routes;