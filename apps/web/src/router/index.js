import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import Login from '@/views/Auth/Login.vue';
import NotFound from '@/views/Errors/NotFound.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [

        {
            path: '/',
            component: AppLayout,
            meta: {
                auth: true
            },
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/gateways',
                    name: 'gateways',
                    component: () => import('@/views/Gateways/Index.vue')
                },
                {
                    path: '/sessions',
                    name: 'sessions',
                    component: () => import('@/views/Sessions/Index.vue')
                },
                {
                    path: '/presences',
                    name: 'presences',
                    component: () => import('@/views/Presences/Index.vue')
                },
                {
                    path: '/reports',
                    name: 'reports',
                    component: () => import('@/views/Reports/Index.vue')
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import('@/views/Users/Index.vue')
                },
                {
                    path: '/siswa',
                    name: 'siswa',
                    component: () => import('@/views/Siswa/Index.vue')
                },
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: {
                auth: false
            }
        },
        {
            path: '/:pathNotFound(.*)*',
            name: 'not-found',
            component: NotFound
        }

    ]
});


export default (app) => {
    app.router = router
    app.use(router)
}