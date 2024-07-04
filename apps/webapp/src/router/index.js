import AppLayout from '@/layout/AppLayout.vue'
import AuthLayout from '@/layout/AuthLayout.vue'
import Login from '@/views/Auth/Login.vue';
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'home',
          component: import('../views/Home/Index.vue'),
        },
        {
          path: '/scan',
          name: 'scan',
          component: import('../views/Scan/Index.vue'),
        },
        {
          path: '/presences',
          name: 'presences',
          component: import('../views/Presences/Index.vue'),
        },
        {
          path: '/account',
          name: 'account',
          component: import('../views/Account/Index.vue'),
        },
        {
          path: '/notifications',
          name: 'notifications',
          component: import('../views/Notifications/Index.vue'),
        },
      ],
    },
    {
      path: '/*',
      component: AuthLayout,
      children: [
        {
          path: '/login',
          name: 'login',
          component: Login,
        }
      ]
    },

  ],
  linkActiveClass: "active-link",
  linkExactActiveClass: "exact-active-link",
})

export default (app) => {
  app.use(router)
} 
