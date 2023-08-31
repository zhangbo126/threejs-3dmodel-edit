import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const ant = {
    install(Vue) {
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            Vue.component(key, component)
        }
        Vue.config.productionTip = false
    }
}

export default ant


