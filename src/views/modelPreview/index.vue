<template>
  <div id="preview">
    <tree-component />
  </div>
</template>
<script setup lang="jsx" name="modelBase">
import { local } from "@/utils/storage";
import { MODEL_PRIVEW_CONFIG } from "@/config/constant";
import { useRouter } from "vue-router";
import { ref } from 'vue'
import createThreeDComponent from "@/utils/initThreeTemplate";
import { ElMessageBox } from 'element-plus'
const router = useRouter();
const config = ref(null)



if (local.get(MODEL_PRIVEW_CONFIG)) {
  config.value = local.get(MODEL_PRIVEW_CONFIG)
} else {
  ElMessageBox.alert(`当前页面出错,返回首页`, '提示', {
    confirmButtonText: '确认',
    type: 'warning'
  }).then(() => {
    router.push({ path: '/' })
  })
}

const treeComponent = createThreeDComponent(config.value);
</script>
<style lang="scss" scoped>
#preview {
  width: 100%;
  height: 100vh;
}
</style>
