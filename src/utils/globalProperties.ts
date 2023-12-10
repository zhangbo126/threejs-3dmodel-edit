import mitt from 'mitt' //全局总事件方法
import { session, local } from './storage'  //会话和本地缓存全局方法
import { App } from 'vue'

const globalProperties = {
	install(Vue: App) {
		Vue.config.globalProperties.$session = session
		Vue.config.globalProperties.$local = local
		Vue.config.globalProperties.$session = session
		Vue.config.globalProperties.$bus = mitt()
		
	}
}

export default {
	...globalProperties
}