<template>
  <div id="preview">
    <tree-component />
  </div>
</template>
<script setup lang="jsx" name="modelBase">
import { local } from "@/utils/storage";
import { MODEL_PRIVEW_CONFIG } from "@/config/constant";
import { useRouter, useRoute } from "vue-router";
import { ref } from 'vue'
import createThreeDComponent from "@/utils/initThreeTemplate";
import { ElMessageBox } from 'element-plus'
const router = useRouter();
const route = useRoute();
const config = ref(null)

const urlParams = new URLSearchParams(url.split('?')[1]);
const modelConfigParam = urlParams.get('modelConfig');
console.log('modelConfigParam', modelConfigParam)

if (local.get(MODEL_PRIVEW_CONFIG)) {
  config.value = local.get(MODEL_PRIVEW_CONFIG)
} else if (modelConfigParam) {
  console.log(decodeURIComponent(modelConfigParam.replace(/'/g, '"')))
  const modelConfig = JSON.parse(decodeURIComponent(modelConfigParam.replace(/'/g, '"')));
  config.value = modelConfig

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
