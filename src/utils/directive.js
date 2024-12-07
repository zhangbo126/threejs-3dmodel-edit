import { createApp } from "vue";
import Loading from "@/components/Loading/index.vue";

/**
 * @description loading 加载状态指令
 * @param {Vue} Vue Vue实例
 */
const directiveLoading = Vue => {
  Vue.directive("zLoading", {
    mounted(el) {
      // 创建loading组件实例
      const loadingApp = createApp(Loading);
      const loadingInstance = loadingApp.mount(document.createElement("div"));

      // 设置样式和初始状态
      el.style.position = "relative";
      loadingInstance.$el.style.display = "none";
      loadingInstance.$el.setAttribute("id", "loading-mark");

      // 将loading组件添加到目标元素
      el.appendChild(loadingInstance.$el);

      // 缓存loading实例,用于卸载时清理
      el._loading_instance = loadingInstance;
    },

    updated(el, binding) {
      const loadingEl = el.querySelector("#loading-mark");
      if (!loadingEl) return;

      const show = binding.value;

      // 根据绑定值控制显示/隐藏
      el.style.position = show ? "relative" : "";
      loadingEl.style.display = show ? "block" : "none";
    },

    unmounted(el) {
      // 清理loading实例和DOM
      if (el._loading_instance) {
        el._loading_instance.$destroy?.();
        delete el._loading_instance;
      }

      const loadingEl = el.querySelector("#loading-mark");
      loadingEl?.parentNode?.removeChild(loadingEl);
    }
  });
};

const directive = {
  install(Vue) {
    directiveLoading(Vue);
  }
};

export default directive;
