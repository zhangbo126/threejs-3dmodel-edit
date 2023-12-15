<template>
  <el-config-provider>
    <router-view />
  </el-config-provider>
</template>
<script setup>
</script>
<style lang="scss">
#mesh-txt {
  position: absolute;
  display: none;
  color: white;
  background-color: #67c23a;
  opacity: 0.8;
  font-size: 14px;
  font-weight: 600;
  pointer-events: none;
  padding: 10px;
  border-radius: 10px;
  cursor: all-scroll;
  -webkit-user-select: none;
  /* Safari 3.1+ */
  -moz-user-select: none;
  /* Firefox 2+ */
  -ms-user-select: none;
  /* IE 10+ */
  user-select: none;
  /* Standard syntax */
}</style>
