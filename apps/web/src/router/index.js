import AppLayout from '@/layout/AppLayout.vue';
import ForbiddenView from '@/views/Errors/Forbidden.vue';
import NotFoundView from '@/views/Errors/NotFound.vue';
import LoginView from '@/views/Auth/Login.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { config } from '../config';


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
                    component: () => import('@/views/Dashboard.vue'),
                    meta: {
                        title: "Dashboard",
                    }
                },
                {
                    path: '/gateways',
                    name: 'gateways',
                    component: () => import('@/views/Gateways/Index.vue'),
                    meta: {
                        title: "Gateways",
                    }
                },
                {
                    path: '/sessions',
                    name: 'sessions',
                    component: () => import('@/views/Sessions/Index.vue'),
                    meta: {
                        title: "Sessions",
                    }
                },
                {
                    path: '/camera',
                    name: 'camera',
                    component: () => import('@/views/Camera/Index.vue'),
                    meta: {
                        title: "Camera",
                    }
                },
                {
                    path: '/camera/:id/scan',
                    name: 'camera-scan',
                    component: () => import('@/views/Camera/Scan.vue'),
                    meta: {
                        title: "Scan",
                    }
                },
                {
                    path: '/presences',
                    name: 'presences',
                    redirect: {
                        name: 'presences-all'
                    },
                    component: () => import('@/views/Presences/Index.vue'),
                    children: [
                        {
                            path: '/presences/all',
                            name: 'presences-all',
                            component: () => import('@/views/Presences/All.vue'),
                            meta: {
                                title: "All Presences",
                            },
                        },
                        {
                            path: '/presences/chart',
                            name: 'presences-recap',
                            component: () => import('@/views/Presences/Chart.vue'),
                            meta: {
                                title: "Chart Presences",
                            },
                        },
                        {
                            path: '/presences/rombel',
                            name: 'presences-recap-rombel',
                            component: () => import('@/views/Presences/Rombel.vue'),
                            meta: {
                                title: "Rombel Presences",
                            },
                        },
                        // {
                        //     path: '/presences/recap',
                        //     name: 'presences-recap',
                        //     component: () => import('@/views/Presences/Recap.vue'),
                        //     meta: {
                        //         title: "Recap Presences",
                        //     },
                        // }
                    ]
                },
                {
                    path: '/change-password',
                    name: 'change-password',
                    component: () => import('@/views/Auth/ChangePassword.vue'),
                    meta: {
                        title: "Change Password",
                    }
                },
                {
                    path: '/profile',
                    name: 'profile',
                    component: () => import('@/views/Auth/Profile.vue'),
                    meta: {
                        title: "Profile",
                    }
                },
                {
                    path: '/backup',
                    name: 'backup',
                    component: () => import('@/views/Backup/Index.vue'),
                    meta: {
                        title: "Backup",
                    }
                },
                // {
                //     path: '/whatsapp',
                //     name: 'whatsapp',
                //     // redirect: {
                //     //     name: 'connection'
                //     // },
                //     component: () => import('@/views/Whatsapp/Index.vue'),
                //     // children: [
                //     //     {
                //     //         path: '/whatsapp/connection',
                //     //         component: () => import('@/views/Whatsapp/tabs/Connection.vue'),
                //     //         name: 'connection',
                //     //         meta: {
                //     //             title: "Connection",
                //     //         }
                //     //     },
                //     //     {
                //     //         path: '/whatsapp/send-message',
                //     //         component: () => import('@/views/Whatsapp/tabs/Message.vue'),
                //     //         name: 'send-message',
                //     //         meta: {
                //     //             title: "Send Message",
                //     //         }
                //     //     },
                //     // ],
                //     meta: {
                //         title: "WhatsApp",
                //         auth: 'admin'
                //     }
                // },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import('@/views/Users/Index.vue'),
                    meta: {
                        title: "Users",
                        auth: "admin"
                    }
                },
                {
                    path: '/siswa',
                    name: 'siswa',
                    component: () => import('@/views/Siswa/Index.vue'),
                    meta: {
                        title: "Siswa",
                    }
                },
            ]
        },
        {
            path: '/login',
            name: 'login',
            // component: import('@/views/Auth/Login.vue'),
            component: LoginView,
            meta: {
                auth: false,
                title: "login"
            }
        },
        {
            path: '/403',
            name: 'forbidden',
            component: ForbiddenView,
            meta: {
                title: "403"
            }
        },
        {
            path: '/:pathNotFound(.*)*',
            name: 'not-found',
            component: NotFoundView,
            meta: {
                title: "404"
            }
        },
        {
            path: '/real-time',
            name: 'RealTime-view',
            component: () => import('@/views/RealTime/Index.vue'),
            meta: {
                title: "Real-Time",
            }
        },
        {
            path: '/real-time/presence',
            name: 'RealTime-presence',
            component: () => import('@/views/RealTime/Presence.vue'),
            meta: {
                title: "Real-Time",
            }
        },
        {
            path: '/real-time/camera',
            name: 'RealTime-camera',
            component: () => import('@/views/RealTime/Camera.vue'),
            meta: {
                title: "Real-Time",
            }
        },
    ]
});


export default (app) => {
    router.beforeEach((to, from, next) => {
        const title = to.meta.title;
        if (title) {
            document.title = `${title} - ${config.app_name}`;
        }
        next();
    });
    app.router = router
    app.config.globalProperties.$router = router;

    app.use(router)
}