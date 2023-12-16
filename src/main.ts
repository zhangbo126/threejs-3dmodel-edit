import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import piniaStore from './store/pinia'
import ElementPlus from 'element-plus'
// 自定义封装全局方法
import GlobalProperties from "@/utils/globalProperties";
// // 全局组件
import GlobalComponent from '@/utils/globalComponent'
// // 自定义全局指令
import Directive from "@/utils/directive";
import 'element-plus/theme-chalk/src/index.scss'
import 'default-passive-events'	
import '@/style/index.scss'

const app = createApp(App)
app.use(ElementPlus, { size: 'small', zIndex: 3000 })
app.use(GlobalProperties)
app.use(GlobalComponent)
app.use(Directive)
app.use(piniaStore)
app.use(router)
app.mount('#app')
