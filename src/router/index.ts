import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'layout',
    component: () => import('@/views/layouts/index.vue'),
    children: [
      {
        path: '/',
        name: 'modelEdit',
        meta: { keepAlive: true },
        component: () => import('@/views/modelEdit/index.vue')
      }
    ]
  }
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
