<template>
  <draggable-resizable
    class="draggable-resizable"
    classNameDragging="dragging"
    classNameActive="active"
    :initW="props.config.width"
    :initH="props.config.height"
    v-model:x="props.config.x"
    v-model:y="props.config.y"
    v-model:w="props.config.width"
    v-model:h="props.config.height"
    :parent="false"
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
import { ref } from "vue";
const props = defineProps({
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
  emit("onDragActive", props.config);
};
// 取消选中
const deactivatedHandle = e => {
  dragMask.value = "";
  emit("onDragDeactivated", props.config.modelKey);
};

const treeComponent = createThreeDComponent(props.config);
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
