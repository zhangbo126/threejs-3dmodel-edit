<template>
  <div class="home-page">
    <div id="model" ref="modelContainer"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import renderModel from "./renderModel";
onMounted(() => {
  const model = new renderModel("#model");
});
</script>

<style lang="less" scoped>
.home-page {
  #model {
    width: 100%;
    height: 100vh;
  }
}
</style>
