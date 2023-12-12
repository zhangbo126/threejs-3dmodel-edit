import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { pageEnums } from '@/enums/pageEnums'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'layout',
    component: () => import('@/views/layouts/index.vue'),
    children: [
      {
        path: pageEnums.MODEL_EDIT,
        name: 'modelEdit',
        meta: { keepAlive: true },
        component: () => import('@/views/modelEdit/index.vue')
      },
      {
        path: pageEnums.MODEL_PREIVEW,
        name: 'modelPreview',
        meta: { keepAlive: false },
        component: () => import('@/views/modelPreview/index.vue')
      },
      {
        path: pageEnums.MODEL_BASE,
        name: 'modelBase',
        meta: { keepAlive: false },
        component: () => import('@/views/modelBase/index.vue')
      }
    ]
  }
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
