import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import GlobalProperties from "@/utils/globalProperties.js";  //自定义封装全局方法
import "ant-design-vue/dist/antd.css";
import '@/style/index.less'
const app = createApp(App)
app.use(Antd)
app.use(GlobalProperties)
app.use(store)
app.use(router)
app.mount('#app')