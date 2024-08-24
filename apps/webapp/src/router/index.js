import { config } from '@/config';
import AppLayout from '@/layout/AppLayout.vue'
import LoginView from '@/views/Auth/Login.vue';
import NotFoundView from '@/views/Errors/NotFound.vue';
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      // meta: {
      //   auth: true
      // },
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('../views/Home/Index.vue'),
        },
        {
          path: '/sessions',
          name: 'sessions',
          component: () => import('../views/Session/Index.vue'),
        },
        {
          path: '/presences',
          name: 'presences',
          component: () => import('../views/Presences/Index.vue'),
        },
        {
          path: '/settings',
          name: 'settings',
          component: () => import('../views/Settings/Index.vue'),
        },
        {
          path: '/notifications',
          name: 'notifications',
          component: () => import('../views/Notifications/Index.vue'),
        },
      ],
    },
    // {
    //   path: '/*',
    //   component: AuthLayout,
    //   children: [
    //     {
    //       path: '/login',
    //       name: 'login',
    //       component: Login,
    //     }
    //   ]
    // },

    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        auth: false,
        title: "login"
      }
    },

    {
      path: '/:pathNotFound(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: {
        title: "404"
      }
    }

  ],
  linkActiveClass: "active-link",
  linkExactActiveClass: "exact-active-link",
})

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
