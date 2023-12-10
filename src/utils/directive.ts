import { createApp, DirectiveBinding, App } from "vue"
import Loading from '@/components/Loading/index.vue'


/**
  * @description loading 加载状态  
 * @params {Vue}   vue实列操作对象
*/

const directiveLoading = (Vue: App) => {
	Vue.directive('zLoading', {
		mounted(el: HTMLElement) {
			const app = createApp(Loading)
			const vNode = app.mount(document.createElement('div'))
			el.style.position = 'relative'
			vNode.$el.style.display = 'none'
			el.appendChild(vNode.$el)
		},
		updated(el: HTMLElement, binding: DirectiveBinding) {
			const loadingNode: HTMLElement | null | undefined = el.parentElement?.querySelector('#loading-mark')
			const { value } = binding
			if (!value) {
				el.style.position = ''
				if (loadingNode) loadingNode.style.display = 'none'

			} else {
				el.style.position = 'relative'
				if (loadingNode) loadingNode.style.display = 'block'
			}
		},
		unmounted(el: HTMLElement) {
			const loadingNode = el.children[0]
			el.removeChild(loadingNode)
		},
	})
}



const directive = {
	install(Vue: App) {
		directiveLoading(Vue)
	}
}

export default directive