<template>
  <div id="preview">
    <tree-component />
  </div>
</template>
<script setup lang="jsx">
import { local } from "@/utils/storage";
import { MODEL_PRIVEW_CONFIG } from "@/config/constant";
const config = local.get(MODEL_PRIVEW_CONFIG);
import createThreeDComponent from "@/utils/initThreeTemplate";
const treeComponent = createThreeDComponent(config);

</script>
<style lang="less" scoped>
#preview {
  width: 100%;
  height: 100vh;
}
</style>
