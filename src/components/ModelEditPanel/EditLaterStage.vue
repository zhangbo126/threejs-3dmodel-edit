<template>
  <div class="edit-box">
    <div class="header">
      <span>后期处理</span>
    </div>
    <!-- 辉光 -->
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
    <div class="options" :class="optionsDisable">
      <div class="option" >
        <div class="grid-txt">
          <el-button type="primary" link>强度</el-button>
        </div>
         <div class="grid-silder">
            <el-slider
            show-input
            v-model="config.strength"
            @change="onChangeFlow"
            :step="0.01"
            :min="0"
            :max="3"
          />
         </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>半径</el-button>
        </div>
         <div class="grid-silder">
            <el-slider
            show-input
            v-model="config.radius"
            @change="onChangeFlow"
            :step="0.01"
            :min="0"
            :max="2"
          />
         </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>阈值</el-button>
        </div>
         <div class="grid-silder">
            <el-slider
            show-input
            v-model="config.threshold"
            @change="onChangeFlow"
            :step="0.01"
            :min="0"
            :max="1"
          />
         </div>
      </div>
    </div>
    <!-- 曝光度 -->
    <div class="options">
      <div class="option space-between">
        <el-space>
          <el-icon>
            <Sunny />
          </el-icon>
          <span> 色调曝光度 </span>
        </el-space>
        <div class="grid-silder">
          <el-slider
          show-input
          v-model="config.toneMappingExposure"
          @change="onChangeFlow"
          :step="0.01"
          :min="0.5"
          :max="10"
        />
       </div>
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
const optionsDisable = computed(() => {
  const { glow } = config;
  return glow ? "" : "disabled";
});

const config = reactive({
    glow: false,
    threshold:0.05,
    strength:0.6,
    radius:1,
    toneMappingExposure:2,
});

const onChangeFlow = () => {
	state.modelApi.onSetUnrealBloomPass(config)
};
defineExpose({
  config
});
</script>
<style lang="scss" scoped></style>
