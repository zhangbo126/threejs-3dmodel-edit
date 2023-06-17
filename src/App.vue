<template>
  <a-config-provider :locale="zhCN" componentSize="small">
      <router-view />
  </a-config-provider>
</template>
<script setup>
import zhCN from "ant-design-vue/es/locale/zh_CN";
</script>
<style lang="less">

</style>
