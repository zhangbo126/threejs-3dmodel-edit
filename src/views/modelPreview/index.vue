<template>
  <div id="preview">
    <tree-component />
  </div>
</template>
<script setup lang="jsx" name="modelPreview">
import { local } from "@/utils/storage";
import { MODEL_PREVIEW_CONFIG } from "@/config/constant";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import createThreeDComponent from "@/utils/initThreeTemplate";
import { ElMessageBox } from "element-plus";

const router = useRouter();
const config = ref(null);

// 初始化配置
const initConfig = () => {
  const previewConfig = local.get(MODEL_PREVIEW_CONFIG);

  if (previewConfig) {
    config.value = previewConfig;
  } else {
    ElMessageBox.alert("当前页面出错,返回首页", "提示", {
      confirmButtonText: "确认",
      type: "warning",
      callback: () => router.push({ path: "/" })
    });
  }
};

onMounted(() => {
  initConfig();
});

// 创建3D组件
const treeComponent = createThreeDComponent(config.value);
</script>
<style lang="scss" scoped>
#preview {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #000000;
}
</style>
