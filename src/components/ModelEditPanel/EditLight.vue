<template>
  <div class="edit-box">
    <div class="header">
      <span>模型灯光</span>
    </div>
    <!-- 环境光 -->
    <div class="options">
      <div class="option space-between">
        <el-space>
          <el-icon>
            <Setting />
          </el-icon>
          <span> 环境光 </span>
        </el-space>
        <el-switch v-model="config.ambientLight" @change="onChangeAmbientLight" />
      </div>
      <div class="option" :class="ambientDisabled">
        <div class="color">
          <el-color-picker
            color-format="hex"
            :predefine="predefineColors"
            @change="onChangeAmbientLight"
            @active-change="changeAmbientLightColor"
            v-model="config.ambientLightColor"
          />
        </div>
        <div class="silder">
          <el-slider
            @change="onChangeAmbientLight"
            v-model="config.ambientLightIntensity"
            :min="-5"
            :max="5"
            :step="0.01"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useStore } from "vuex";
import { PREDEFINE_COLORS } from "@/config/constant";
const store = useStore();
const config = reactive({
  ambientLight: false,
  ambientLightColor: '#fff',
  ambientLightIntensity: 1,
  activeAmbientUrl: "threeFile/hdr/hrd-1.hrd",
});
const predefineColors = PREDEFINE_COLORS;
const ambientDisabled = computed(() => {
  const { ambientLight } = config;
  return ambientLight ? "" : "disabled";
});
const state = reactive({
  modelApi: computed(() => {
    return store.state.modelApi;
  }),
});
const changeAmbientLightColor = () => {};

const onChangeAmbientLight = () => {
  state.modelApi.onSetModelAmbientLight(config);
};

</script>

<style scoped lang="scss">
.silder {
  padding-left: 12px;
  width: 270px;
}
.anambient-img {
  padding: 0px 10px;
  ul {
    display: flex;
    flex-wrap: wrap;
  }
  .anambient-active {
    border: 2px solid #4d57fd;
    box-sizing: border-box;

  }
  li {
    margin: 0px 4px;
    position: relative;
    cursor: pointer;
 
  }
}
</style>
