<template>
  <div id="vr-page">
    <div id="vr-model"></div>
    <video id="video" playsinline muted autoplay></video>
  </div>
</template>
<script setup name="vrPage">
import { onMounted } from "vue";
import vrRenderModel from "@/utils/vrRenderModel";

onMounted(async () => {
  const modelApi = new vrRenderModel("#vr-model");
  const load = await modelApi.init();
});
</script>

<style lang="scss" scoped>
#vr-page {
  position: relative;
  width: 100%;
  height: 100vh;
  #vr-model {
    width: 100%;
    height: 100%;
  }
}
#video {
  display: none;
  object-fit: cover;
}
</style>
