import { createApp } from "vue"
import Loading from '@/components/Loading'
/**
  * @description loading 加载状态  
 * @params {Vue}   vue实列操作对象
*/

const directiveLoading = (Vue) => {
	Vue.directive('Loading', {
		mounted(el, binding, vnode) {
			const app = createApp(Loading)
			const vNode = app.mount(document.createElement('div'))
			el.style.position = 'relative'
			vNode.$el.style.display = 'none'
			el.appendChild(vNode.$el)
		},
		updated(el, binding, vnode) {
			const loadingNode = el.parentElement.querySelector('#loading-mark')
			const { value } = binding
			if (!value) {
				el.style.position = ''
				loadingNode.style.display = 'none'
			} else {
				el.style.position = 'relative'
				loadingNode.style.display = 'block'
			}
		},
		unmounted(el, binding, vnode) {
			const loadingNode = el.children[0]
			el.removeChild(loadingNode)
		},
	})
}



const directive = {
	install(Vue) {
		directiveLoading(Vue)
	}
}

export default directive