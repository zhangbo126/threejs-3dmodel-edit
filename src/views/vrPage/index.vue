<template>
  <div class="vr-page">
    <div id="vr-model"></div>
    <!-- <el-button @click="openVR">打开摄像头</el-button> -->
  </div>
</template>
<script setup name="arPage">
import { onMounted } from "vue";
import { useMeshEditStore } from "@/store/meshEditStore";
import renderModel from "@/utils/renderModel";

const store = useMeshEditStore();
const openVR = () => {
  store.modelApi.openCameraAR();
};
onMounted(async () => {
  const modelApi = new renderModel("#vr-model");
  const load = await modelApi.init();
  store.setModelApi(modelApi);
  if (load) {
    store.modelApi.openCameraAR();
  }
});
</script>

<style lang="scss" scoped>
.vr-pag {
  width: 100%;
  height: 100%;
}
#vr-model {
  width: calc(100%);
  height: calc(100vh);
}
</style>
