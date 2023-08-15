<template>
  <div class="edit-box">
    <div class="header">
      <span>后期处理</span>
    </div>
    <div class="options">
      <div class="option space-between">
        <el-space>
          <el-icon>
            <Sunny />
          </el-icon>
          <span> 辉光 </span>
        </el-space>
        <el-switch v-model="config.glow" @change="onChangeFlow" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed } from "vue";
import { useStore } from "vuex";
const store = useStore();
const state = reactive({
  modelApi: computed(() => {
    return store.state.modelApi;
  }),
});
const config = reactive({
    glow: false,
});

const onChangeFlow = () => {
	state.modelApi.createUnrealBloomPass()
};
</script>
<style lang="scss" scoped></style>
