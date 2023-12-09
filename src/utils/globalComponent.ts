import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { App } from 'vue'
const ant = {
	install(Vue: App) {
		for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
			Vue.component(key, component)
		}
	}
}

export default ant


