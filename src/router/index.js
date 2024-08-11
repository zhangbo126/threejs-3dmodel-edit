import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    name: 'layout',
    path: '/',
    component: () => import('@/views/layouts/index.vue'),
    children: [
      {
        path: '/',
        name: 'modelEdit',
        meta: { keepAlive: true },
        component: () => import('@/views/modelEdit/index.vue')
      },
      {
        path: '/preview',
        name: 'modelPreview',
        meta: { keepAlive: false },
        component: () => import('@/views/modelPreview/index.vue')
      },
      {
        path: '/modelIframe',
        name: 'modelIframe',
        meta: { keepAlive: false },
        component: () => import('@/views/modelIframe/index.vue')
      },
      {
        path: '/modelBase',
        name: 'modelBase',
        meta: { keepAlive: false },
        component: () => import('@/views/modelBase/index.vue')
      }
    ]
  }
]
const base = import.meta.env.VITE_APP_BASE_URL
const router = createRouter({
  history: createWebHistory(base),
  base,
  model: 'hash',
  routes
})

export default router
