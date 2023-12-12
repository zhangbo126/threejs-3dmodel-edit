<template>
  <div id="preview">
    <tree-component v-if="config" />
  </div>
</template>
<script setup lang="jsx" name="modelBase">
import { ElMessageBox } from 'element-plus';
import { local } from "@/utils/storage";
import { MODEL_PRIVEW_CONFIG } from "@/config/constant.ts";
import createThreeDComponent from "@/utils/initThreeTemplate.ts";
import { pageEnums } from '@/enums/pageEnums'
import { useRouter } from "vue-router";
import { onMounted } from 'vue'
const router = useRouter();
const config = local.get(MODEL_PRIVEW_CONFIG);
if (!config) {
  ElMessageBox.alert(`当前页面出错,返回首页`, '提示', {
    confirmButtonText: '确认',
    type: 'warning'
  }).then(() => {
    router.push({ path: pageEnums.MODEL_EDIT })
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
