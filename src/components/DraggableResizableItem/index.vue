<template>
  <draggable-resizable
    classNameDragging="dragging"
    :initW="500"
    :initH="350"
    :x="10"
    :y="10"
    :parent="true"
    :resizable="true"
    :draggable="true"
	@dragging="dragging"
  >
    <tree-component></tree-component>
  </draggable-resizable>
</template>
<script setup>
import DraggableResizable from "vue3-draggable-resizable";
import createThreeDComponent from "@/utils/initThreeTemplate";
import "vue3-draggable-resizable/dist/Vue3DraggableResizable.css";
const props = defineProps({
  config: {
    type: Object,
    default: {},
  },
});
const dragging =(e)=>{
}
const treeComponent = createThreeDComponent(props.config);
</script>

<style lang="less" scoped></style>
