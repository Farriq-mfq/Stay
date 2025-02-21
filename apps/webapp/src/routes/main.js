import { createRouter, createWebHistory } from 'vue-router'
import { checkRoleSelectedMiddleware } from './middleware/role-selected'
import { loadLayoutMiddleware } from './middleware/loadLayoutMiddleware'


/**
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const routes = [
    {
        path: '/',
        name: 'role',
        component: () => import('@/views/main/SelectRole.vue'),
        meta: {
            layout: 'SelectRoleLayout'
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(checkRoleSelectedMiddleware)
router.beforeEach(loadLayoutMiddleware)

export default router