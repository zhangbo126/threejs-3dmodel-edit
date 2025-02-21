<template>
  <el-config-provider>
    <router-view />
    <MessageTipDialog ref="messageTipDialog" />
  </el-config-provider>
</template>
<script setup>
import { onMounted, ref } from "vue";
import MessageTipDialog from "@/components/MessageTipDialog/index.vue";
const messageTipDialog = ref(null);
onMounted(() => {
  messageTipDialog.value.showDialog();
});
</script>
