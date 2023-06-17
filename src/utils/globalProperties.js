
import mitt from 'mitt' //全局总事件方法
const globalProperties = {
	install(Vue) {
		Vue.config.globalProperties.$bus = mitt()
	}
}

export default {
	...globalProperties
}