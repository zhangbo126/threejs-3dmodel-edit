import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    name: 'modelEdit',
    component:  () => import('@/views/modelEdit/index.vue')
  },
  {
    path: '/preview',
    name: 'modelPreview',
    component:  () => import('@/views/modelPreview/index.vue')
  },
  {
    path: '/modelBase',
    name: 'modelBase',
    component:  () => import('@/views/modelBase/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  base:process.env.BASE_URL,
  model:'hash',
  routes
})

export default router
