import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/gateways',
                    name: 'gateways',
                    component: () => import('@/views/pages/Gateways/Index.vue')
                },
                {
                    path: '/sessions',
                    name: 'sessions',
                    component: () => import('@/views/pages/Sessions/Index.vue')
                },
                {
                    path: '/presences',
                    name: 'presences',
                    component: () => import('@/views/pages/Presences/Index.vue')
                },
                {
                    path: '/reports',
                    name: 'reports',
                    component: () => import('@/views/pages/Reports/Index.vue')
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import('@/views/pages/Users/Index.vue')
                },
                {
                    path: '/siswa',
                    name: 'siswa',
                    component: () => import('@/views/pages/Siswa/Index.vue')
                },
            ]
        },
    ]
});

export default router;
