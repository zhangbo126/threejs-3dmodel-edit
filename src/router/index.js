import { createRouter, createWebHashHistory } from "vue-router";
const routes = [
  {
    name: "EditView",
    path: "/",
    component: () => import("@/layouts/EditView.vue"),
    children: [
      {
        path: "/",
        name: "modelEdit",
        meta: { keepAlive: true },
        component: () => import("@/views/modelEdit/index.vue")
      },
      {
        path: "/preview",
        name: "modelPreview",
        meta: { keepAlive: false },
        component: () => import("@/views/modelPreview/index.vue")
      },
      {
        path: "/modelIframe",
        name: "modelIframe",
        meta: { keepAlive: false },
        component: () => import("@/views/modelIframe/index.vue")
      },
      {
        path: "/modelBase",
        name: "modelBase",
        meta: { keepAlive: false },
        component: () => import("@/views/modelBase/index.vue")
      }
    ]
  },
  {
    path: "/vrView",
    name: "VrView",
    component: () => import("@/layouts/VrView.vue"),
    children: [
      {
        path: "/vrPage",
        name: "vrPage",
        meta: { keepAlive: false },
        component: () => import("@/views/vrPage/index.vue")
      }
    ]
  }
];
const base = import.meta.env.VITE_APP_BASE_URL;
const router = createRouter({
  history: createWebHashHistory(base),
  routes
});

export default router;
