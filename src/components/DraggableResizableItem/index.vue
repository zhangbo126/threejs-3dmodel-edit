<!-- eslint-disable vue/valid-v-model -->
<template>
  <draggable-resizable
    class="draggable-resizable"
    class-name-dragging="dragging"
    class-name-active="active"
    :init-w="config.width"
    :init-h="config.height"
    :x="config.x"
    :y="config.y"
    :w="config.width"
    :h="config.height"
    :parent="false"
    :resizable="true"
    :draggable="true"
    @update:x="val => (config.x = val)"
    @update:y="val => (config.y = val)"
    @update:w="val => (config.width = val)"
    @update:h="val => (config.height = val)"
    @drag-end="dragEndHandle"
    @dragging="dragHandle"
    @activated="activatedHandle"
    @deactivated="deactivatedHandle"
  >
    <tree-component :width="config.width" :height="config.height"></tree-component>
    <div :class="dragMask" class="mask"></div>
  </draggable-resizable>
</template>
<script setup>
import DraggableResizable from "vue3-draggable-resizable";
import createThreeDComponent from "@/utils/initThreeTemplate";
import { ref } from "vue";
const { config } = defineProps({
  config: {
    type: Object,
    default: {}
  }
});

const emit = defineEmits(["onDragActive", "onDragDeactivated"]);

const dragMask = ref("");
// 开始拖拽
const dragHandle = e => {
  dragMask.value = "mask-dragging";
};
// 拖拽结束
const dragEndHandle = e => {
  dragMask.value = "mask-dragactive";
};
// 选中
const activatedHandle = e => {
  dragMask.value = "mask-dragactive";
  emit("onDragActive", config);
};
// 取消选中
const deactivatedHandle = e => {
  dragMask.value = "";
  emit("onDragDeactivated", config.modelKey);
};

const treeComponent = createThreeDComponent(config);
</script>

<style lang="scss" scoped>
.draggable-resizable {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background-color: #f0c314;
    box-shadow: 1px 1px 40px #15d7aa;
  }
  .mask-dragactive {
    display: block;
    opacity: 0.2;
  }
  .mask-dragging {
    display: block;
    opacity: 0.1;
  }
}
.active {
  z-index: 100;
  cursor: all-scroll;
  border-color: #d5ad11;
  border-style: solid;
  border-width: 2px;
}
</style>
