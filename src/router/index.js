import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    name: 'modelPage',
    component:  () => import(/* webpackChunkName: "about" */ '@/views/modelPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  base:process.env.BASE_URL,
  model:'hash',
  routes
})

export default router
