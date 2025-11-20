<template>
  <div id="vr-page">
    <!-- <model-viewer
      class="model-viewer"
      src="https://three3d-0gte3eg619c78ffd-1301256746.tcloudbaseapp.com/threejs-3dmodel-edit/threeFile/glb/glb-9.glb"
      ar
      shadow-intensity="1"
      camera-controls
      touch-action="pan-y"
    ></model-viewer> -->
  </div>
</template>
<script setup name="vrPage"></script>
<style lang="scss" scoped>
#vr-page {
  position: relative;
  width: 100%;
  height: 100vh;
}
.model-viewer {
  width: 100%;
  height: 100%;
}
</style>
