<template>
  <div id="preview">
    <tree-component />
  </div>
</template>
<script setup lang="jsx" name="modelBase">
import { local } from "@/utils/storage";
import { MODEL_PRIVEW_CONFIG } from "@/config/constant";
import { useRouter, useRoute } from "vue-router";
import createThreeDComponent from "@/utils/initThreeTemplate";
const router = useRouter();
const route = useRoute();
const { modelConfig } = route.query
const config = local.get(MODEL_PRIVEW_CONFIG) || JSON.parse(modelConfig);
if (!config) {
  ElMessageBox.alert(`当前页面出错,返回首页`, '提示', {
    confirmButtonText: '确认',
    type: 'warning'
  }).then(() => {
    router.push({ path: '/' })
  })
}
const treeComponent = createThreeDComponent(config);

</script>
<style lang="scss" scoped>
#preview {
  width: 100%;
  height: 100vh;
}
</style>
