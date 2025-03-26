import AppLayout from '@/layout/AppLayout.vue';
import ForbiddenView from '@/views/Errors/Forbidden.vue';
import NotFoundView from '@/views/Errors/NotFound.vue';
import LoginView from '@/views/Auth/Login.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { config } from '../config';
import { inject } from "vue";


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
                        permission: 'gateways:read'
                    }
                },
                {
                    path: '/sessions',
                    name: 'sessions',
                    component: () => import('@/views/Sessions/Index.vue'),
                    meta: {
                        title: "Sessions",
                        permission: 'sessions:read'
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
                        name: 'presences-all',
                    },
                    component: () => import('@/views/Presences/Index.vue'),
                    children: [
                        {
                            path: '/presences/all',
                            name: 'presences-all',
                            component: () => import('@/views/Presences/All.vue'),
                            meta: {
                                title: "All Presences",
                                permission: 'presences:read'
                            },
                        },
                        {
                            path: '/presences/daily',
                            name: 'presences-recap-daily',
                            component: () => import('@/views/Presences/Daily.vue'),
                            meta: {
                                title: "Rombel Presences Harian",
                                permission: 'presences:read-daily'
                            },
                        },
                        {
                            path: '/presences/monthly',
                            name: 'presences-recap-month',
                            component: () => import('@/views/Presences/Monthly.vue'),
                            meta: {
                                title: "Rekap Presences Bulanan",
                                permission: 'presences:read-monthly'
                            },
                        },
                    ]
                },
                {
                    path: '/pegawai-presences',
                    name: 'pegawai-presences',
                    redirect: {
                        name: 'pegawai-presences-all'
                    },
                    component: () => import('@/views/Presences/Pegawai/Index.vue'),
                    children: [
                        {
                            path: '/pegawai-presences/all',
                            name: 'pegawai-presences-all',
                            component: () => import('@/views/Presences/Pegawai/All.vue'),
                            meta: {
                                title: "All Presences Pegawai",
                            },
                        },
                        {
                            path: '/pegawai-presences/daily',
                            name: 'pegawai-presences-recap-daily',
                            component: () => import('@/views/Presences/Pegawai/Daily.vue'),
                            meta: {
                                title: "Group Presences Harian",
                            },
                        },
                        {
                            path: '/pegawai-presences/monthly',
                            name: 'pegawai-presences-month',
                            component: () => import('@/views/Presences/Pegawai/Monthly.vue'),
                            meta: {
                                title: "Rekap Presences Bulanan",
                            },
                        },
                        {
                            path: '/pegawai-presences/meeting-session',
                            name: 'pegawai-presences-meeting-session',
                            component: () => import('@/views/Presences/Pegawai/Meeting.vue'),
                            meta: {
                                title: "Rekap Presences Bulanan",
                            },
                        },
                    ]
                },
                {
                    path: '/input/presences',
                    name: 'presences-input',
                    component: () => import('@/views/Presences/Input.vue'),
                    meta: {
                        title: "Input Presence",
                    },
                },
                {
                    path: '/stats',
                    name: 'stats',
                    redirect: {
                        name: 'stats-all'
                    },
                    component: () => import('@/views/Stats/Index.vue'),
                    children: [
                        {
                            path: '/stats/all',
                            name: 'stats-all',
                            component: () => import('@/views/Stats/All.vue'),
                            meta: {
                                title: "Stats Presences",
                            },
                        },
                        {
                            path: '/stats/rombel',
                            name: 'stats-rombel',
                            component: () => import('@/views/Stats/Rombel.vue'),
                            meta: {
                                title: "Stats Presences By Rombel",
                            },
                        },
                    ]
                },
                {
                    path: '/payment',
                    name: 'payment',
                    redirect: {
                        name: 'payment-all'
                    },
                    component: () => import('@/views/Payment/Index.vue'),
                    children: [
                        {
                            path: '/payment/all',
                            name: 'payment-all',
                            component: () => import('@/views/Payment/All.vue'),
                            meta: {
                                title: "Payment",
                            },
                        },
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
                {
                    path: '/connected-client',
                    name: 'connected-client',
                    component: () => import('@/views/Client/Index.vue'),
                    meta: {
                        title: "Connected Client",
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
                    path: '/siswa',
                    name: 'siswa',
                    component: () => import('@/views/Siswa/Index.vue'),
                    meta: {
                        title: "Siswa",
                    }
                },
                {
                    path: '/pegawai',
                    name: 'pegawai',
                    component: () => import('@/views/Pegawai/Index.vue'),
                    meta: {
                        title: "Pegawai",
                    }
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import('@/views/Users/Index.vue'),
                    meta: {
                        title: "Users"
                    }
                },
                {
                    path: '/roles',
                    name: 'roles',
                    component: () => import('@/views/Roles/Index.vue'),
                    meta: {
                        title: "Roles"
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
        const permission = to.meta.permission;
        const auth = inject('auth')
        if (permission) {
            if (auth.user()) {
                const permissions = auth.user().permissions;
                permissions.includes(permission) ? next() : next({ name: 'forbidden' });
            }
        }

        next();
    });

    app.router = router
    app.config.globalProperties.$router = router;

    app.use(router)
}