import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    name: 'layout',
    path: '/',
    component: () => import('@/views/layouts/index'),
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
        path: '/modelBase',
        name: 'modelBase',
        meta: { keepAlive: false },
        component: () => import('@/views/modelBase/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  base: process.env.BASE_URL,
  model: 'hash',
  routes
})

export default router
