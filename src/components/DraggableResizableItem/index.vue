<template>
  <draggable-resizable
    class="draggable-resizable"
    classNameDragging="dragging"
    classNameActive="active"
    :initW="600"
    :initH="400"
    :x="100"
    :y="0"
    v-model:w="props.config.width"
    v-model:h="props.config.height"
    :parent="true"
    :resizable="true"
    :draggable="true"
    @drag-end="dragEndHandle"
    @dragging="dragHandle"
    @activated="activatedHandle"
    @deactivated="deactivatedHandle"
  >
      <tree-component :width="props.config.width" :height="props.config.height"></tree-component>
      <div :class="dragMask" class="mask"></div>
  </draggable-resizable>
</template>
<script setup>
import DraggableResizable from "vue3-draggable-resizable";
import createThreeDComponent from "@/utils/initThreeTemplate";
import "vue3-draggable-resizable/dist/Vue3DraggableResizable.css";
import { ref, computed } from "vue";
const props = defineProps({
  config: {
    type: Object,
    default: {}
  }
});

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
};
// 取消选中
const deactivatedHandle = e => {
  dragMask.value = "";
};
const treeComponent = createThreeDComponent(props.config);
</script>

<style lang="less" scoped>
.draggable-resizable {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f0c314;
    pointer-events: none;
    display: none;
    box-shadow: 1px 1px 40px #15d7aa;
  }
  .mask-dragactive {
    opacity: 0.2;
    display: block;
  }
  .mask-dragging {
    opacity: 0.1;
    display: block;
  }
}

.active {
  cursor: all-scroll;
  border-style: solid;
  border-color: #d5ad11;
  border-width: 2px;
}
</style>
