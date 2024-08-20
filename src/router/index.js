import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    name: 'EditView',
    path: '/',
    component: () => import('@/layouts/EditView.vue'),
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
  }, {
    name: 'H5View',
    path: '/h5view',
    component: () => import('@/layouts/H5View.vue'),
    children: [
      {
        path: '/h5vrPage',
        name: 'H5vrPage',
        meta: { keepAlive: false },
        component: () => import('@/views/vrPage/index.vue')
      },
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
