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
          <span>环境光</span>
        </el-space>
        <el-switch v-model="config.ambientLight" @change="onChangeAmbientLight" />
      </div>
      <div class="option" :class="ambientDisabled">
        <div class="color">
          <el-color-picker color-format="hex" v-model="config.ambientLightColor" :predefine="predefineColors"
            @change="onChangeAmbientLight" @active-change="changeAmbientLightColor" />
        </div>
        <div class="silder">
          <el-slider @change="onChangeAmbientLight" v-model="config.ambientLightIntensity" :min="-5" :max="5"
            :step="0.01" />
        </div>
      </div>
    </div>
    <!-- 平行光 -->
    <div class="options">
      <div class="option space-between">
        <el-space>
          <el-icon>
            <Setting />
          </el-icon>
          <span>平行光</span>
        </el-space>
        <el-switch v-model="config.directionalLight" @change="onChangeDirectionalLight" />
      </div>
      <div class="option" :class="directionaDisabled">
        <div class="color">
          <el-color-picker color-format="hex" v-model="config.directionalLightColor" :predefine="predefineColors"
            @change="onChangeDirectionalLight" @active-change="changeDirectionalLightColor" />
        </div>
        <div class="silder">
          <el-slider @change="onChangeDirectionalLight" v-model="config.directionalLightIntensity" :min="-5" :max="5"
            :step="0.01" />
        </div>
      </div>
      <!-- 水平方向 -->
      <div class="option" :class="directionaDisabled">
        <div class="grid-txt">
          <el-button type="text">水平方向</el-button>
        </div>
        <div class="grid-silder">
          <el-slider @change="onChangeDirectionalLight" v-model="config.directionalHorizontal" :min="-10" :max="10"
            :step="0.01" />
        </div>
      </div>
      <!-- 垂直方向方向 -->
      <div class="option" :class="directionaDisabled">
        <div class="grid-txt">
          <el-button type="text">垂直方向</el-button>
        </div>
        <div class="grid-silder">
          <el-slider @change="onChangeDirectionalLight" v-model="config.directionalVertical" :min="-10" :max="10"
            :step="0.01" />
        </div>
      </div>
      <!-- 光源距离 -->
      <div class="option" :class="directionaDisabled">
        <div class="grid-txt">
          <el-button type="text">光源距离</el-button>
        </div>
        <div class="grid-silder">
          <el-slider @change="onChangeDirectionalLight" v-model="config.directionalSistance" :min="0" :max="10"
            :step="0.01" />
        </div>
      </div>
      <!-- <div class="option" :class="directionaDisabled">
        <div class="grid-txt">
          <el-button type="text">X 轴</el-button>
        </div>
        <div class="grid-silder">
          <el-slider @change="onChangeDirectionalLight" v-model="config.directionalLightX" :min="-100" :max="100"
            :step="0.01" />
        </div>
      </div>
      <div class="option" :class="directionaDisabled">
        <div class="grid-txt">
          <el-button type="text">Y 轴</el-button>
        </div>
        <div class="grid-silder">
          <el-slider @change="onChangeDirectionalLight" v-model="config.directionalLightY" :min="-20" :max="20"
            :step="0.01" />
        </div>
      </div>
      <div class="option" :class="directionaDisabled">
        <div class="grid-txt">
          <el-button type="text">Z 轴</el-button>
        </div>
        <div class="grid-silder">
          <el-slider @change="onChangeDirectionalLight" v-model="config.directionalLightZ" :min="-100" :max="100"
            :step="0.01" />
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useStore } from "vuex";
import { PREDEFINE_COLORS } from "@/config/constant";
const store = useStore();
const config = reactive({
  ambientLight: true,
  ambientLightColor: "#fff",  
  ambientLightIntensity: 1,
  directionalLight: false,
  directionalLightColor: "#fff",
  directionalLightIntensity: 1,
  directionalHorizontal:0,
  directionalVertical:0,
  directionalSistance:2

});

const predefineColors = PREDEFINE_COLORS;
const ambientDisabled = computed(() => {
  const { ambientLight } = config;
  return ambientLight ? "" : "disabled";
});
const directionaDisabled = computed(() => {
  const { directionalLight } = config;
  return directionalLight ? "" : "disabled";
});

const state = reactive({
  modelApi: computed(() => {
    return store.state.modelApi;
  })
});
const changeAmbientLightColor = ambientLightColor => {
  config.ambientLightColor = ambientLightColor;
  state.modelApi.onSetModelAmbientLight(config);
};

// 设置环境光
const onChangeAmbientLight = () => {
  state.modelApi.onSetModelAmbientLight(config);
};

const changeDirectionalLightColor = directionalLightColor => {
  config.directionalLightColor = directionalLightColor;
  state.modelApi.onSetModelDirectionalLight(config);
};

// 设置平行光
const onChangeDirectionalLight = () => {
  state.modelApi.onSetModelDirectionalLight(config);
}
</script>

<style scoped lang="scss">
.silder {
  padding-left: 12px;
  width: 270px;
}

.grid-style {
  min-width: 110px;
}

.grid-silder {
  flex: 5;
  padding-left: 10px;
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
}</style>
