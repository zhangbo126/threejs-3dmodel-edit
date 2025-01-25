<template>
  <div class="edit-box">
    <div class="header">
      <span>模型灯光</span>
      <el-button type="primary" icon="Refresh" @click="onInitialize"> 重置 </el-button>
    </div>
    <el-scrollbar height="calc(100vh - 130px)">
      <!-- 环境光 -->
      <div class="options">
        <div class="option space-between">
          <el-space>
            <el-icon>
              <Odometer />
            </el-icon>
            <span>环境光</span>
          </el-space>
          <el-switch v-model="config.ambientLight" @change="onChangeAmbientLight" />
        </div>
        <div class="option" :class="ambientDisabled">
          <div class="color">
            <el-color-picker
              color-format="hex"
              v-model="config.ambientLightColor"
              :predefine="predefineColors"
              @change="onChangeAmbientLight"
              @active-change="changeAmbientLightColor"
            />
          </div>
          <div class="silder">
            <el-slider
              show-input
              @input="onChangeAmbientLight"
              v-model="config.ambientLightIntensity"
              :min="-5"
              :max="5"
              :step="0.01"
            />
          </div>
        </div>
      </div>
      <!-- 平行光 -->
      <div class="options">
        <div class="option space-between">
          <el-space>
            <el-icon>
              <SetUp />
            </el-icon>
            <span>平行光</span>
          </el-space>
          <el-switch v-model="config.directionalLight" @change="onChangeDirectionalLight" />
        </div>
        <div class="option" :class="directionaDisabled">
          <div class="color">
            <el-color-picker
              color-format="hex"
              v-model="config.directionalLightColor"
              :predefine="predefineColors"
              @change="onChangeDirectionalLight"
              @active-change="changeDirectionalLightColor"
            />
          </div>
          <div class="silder">
            <el-slider
              show-input
              @input="onChangeDirectionalLight"
              v-model="config.directionalLightIntensity"
              :min="-5"
              :max="15"
              :step="0.01"
            />
          </div>
        </div>
        <div class="option" :class="directionaDisabled">
          <!-- 阴影 -->
          <div class="grid-txt">
            <el-button type="primary" link>是否开启阴影</el-button>
          </div>
          <div class="grid-sidle">
            <el-switch v-model="config.directionShadow" @change="onChangeDirectionalLight" />
          </div>
          <!-- 辅助线 -->
          <el-space>
            <div class="grid-txt">
              <el-button type="primary" link>辅助线</el-button>
            </div>
            <div class="grid-sidle">
              <el-switch v-model="config.directionalLightHelper" @change="onChangeDirectionalLight" />
            </div>
          </el-space>
        </div>
        <!-- 水平方向 -->
        <div class="option" :class="directionaDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>水平方向</el-button>
          </div>
          <div class="grid-sidle">
            <el-slider
              show-input
              @input="onChangeDirectionalLight"
              v-model="config.directionalHorizontal"
              :min="-10"
              :max="10"
              :step="0.01"
            />
          </div>
        </div>
        <!-- 垂直方向方向 -->
        <div class="option" :class="directionaDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>垂直方向</el-button>
          </div>
          <div class="grid-sidle">
            <el-slider
              show-input
              @input="onChangeDirectionalLight"
              v-model="config.directionalVertical"
              :min="-10"
              :max="10"
              :step="0.01"
            />
          </div>
        </div>
        <!-- 光源距离 -->
        <div class="option" :class="directionaDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>光源距离</el-button>
          </div>
          <div class="grid-sidle">
            <el-slider
              show-input
              @input="onChangeDirectionalLight"
              v-model="config.directionalSistine"
              :min="0"
              :max="10"
              :step="0.01"
            />
          </div>
        </div>
      </div>
      <!-- 点光源 -->
      <div class="options">
        <div class="option space-between">
          <el-space>
            <el-icon>
              <Place />
            </el-icon>
            <span>点光源</span>
          </el-space>
          <el-switch v-model="config.pointLight" @change="onChangePointLight" />
        </div>
        <div class="option" :class="pointDisabled">
          <!-- 辅助线 -->
          <el-space>
            <div class="grid-txt">
              <el-button type="primary" link>辅助线</el-button>
            </div>
            <div class="grid-sidle">
              <el-switch v-model="config.pointLightHelper" @change="onChangePointLight" />
            </div>
          </el-space>
        </div>
        <div class="option" :class="pointDisabled">
          <div class="color">
            <el-color-picker
              color-format="hex"
              v-model="config.pointLightColor"
              :predefine="predefineColors"
              @change="onChangePointLight"
              @active-change="changePointLightColor"
            />
          </div>
          <div class="silder">
            <el-slider
              show-input
              @input="onChangePointLight"
              v-model="config.pointLightIntensity"
              :min="-20"
              :max="60"
              :step="0.1"
            />
          </div>
        </div>
        <!-- 水平方向 -->
        <div class="option" :class="pointDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>水平方向</el-button>
          </div>
          <div class="grid-sidle">
            <el-slider
              show-input
              @input="onChangePointLight"
              v-model="config.pointHorizontal"
              :min="-10"
              :max="10"
              :step="0.11"
            />
          </div>
        </div>
        <!-- 垂直方向方向 -->
        <div class="option" :class="pointDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>垂直方向</el-button>
          </div>
          <div class="grid-sidle">
            <el-slider show-input @input="onChangePointLight" v-model="config.pointVertical" :min="-10" :max="10" :step="0.1" />
          </div>
        </div>
        <!-- 光源距离 -->
        <div class="option" :class="pointDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>光源距离</el-button>
          </div>
          <div class="grid-sidle">
            <el-slider show-input @input="onChangePointLight" v-model="config.pointDistance" :min="0" :max="10" :step="0.1" />
          </div>
        </div>
      </div>
      <!-- 聚光灯 -->
      <div class="options">
        <div class="option space-between">
          <el-space>
            <el-icon>
              <Orange />
            </el-icon>
            <span>聚光灯</span>
          </el-space>
          <el-switch v-model="config.spotLight" @change="onChangeSpotLight" />
        </div>
        <div class="option" :class="spotDisabled">
          <div class="color">
            <el-color-picker
              color-format="hex"
              v-model="config.spotLightColor"
              :predefine="predefineColors"
              @change="onChangeSpotLight"
              @active-change="changeSpotLightColor"
            />
          </div>
          <div class="silder">
            <el-slider
              show-input
              @input="onChangeSpotLight"
              v-model="config.spotLightIntensity"
              :min="0"
              :max="2000"
              :step="0.1"
            />
          </div>
        </div>
        <!-- 阴影 -->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>是否开启阴影</el-button>
          </div>
          <div class="grid-sidle">
            <el-switch v-model="config.spotCastShadow" @change="onChangeSpotLight" />
          </div>
          <!-- 辅助线 -->
          <el-space>
            <div class="grid-txt">
              <el-button type="primary" link>辅助线</el-button>
            </div>
            <div class="grid-sidle">
              <el-switch v-model="config.spotLightHelper" @change="onChangeSpotLight" />
            </div>
          </el-space>
        </div>
        <!-- 水平方向 -->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>水平方向</el-button>
          </div>
          <div class="grid-sidle">
            <el-slider show-input @input="onChangeSpotLight" v-model="config.spotHorizontal" :min="-10" :max="10" :step="0.1" />
          </div>
        </div>
        <!-- 垂直方向方向 -->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>垂直方向</el-button>
          </div>
          <div class="grid-sidle">
            <el-slider show-input @input="onChangeSpotLight" v-model="config.spotVertical" :min="-10" :max="10" :step="0.1" />
          </div>
        </div>
        <!-- 光源距离 -->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>光源距离</el-button>
          </div>
          <div class="grid-sidle">
            <el-slider show-input @input="onChangeSpotLight" v-model="config.spotSistine" :min="0" :max="10" :step="0.1" />
          </div>
        </div>
        <!-- 光线照射范围 -->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>光线照射范围</el-button>
          </div>
          <div class="grid-sidle">
            <el-slider show-input @input="onChangeSpotLight" v-model="config.spotAngle" :min="0" :max="2" :step="0.01" />
          </div>
        </div>
        <!-- 边缘聚光度 -->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>边缘聚光度</el-button>
          </div>
          <div class="grid-sidle">
            <el-slider show-input @input="onChangeSpotLight" v-model="config.spotPenumbra" :min="0" :max="1" :step="0.01" />
          </div>
        </div>
        <!-- 聚光度 强度-->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>投影聚焦度</el-button>
          </div>
          <div class="grid-sidle">
            <el-slider show-input @input="onChangeSpotLight" v-model="config.spotFocus" :min="0" :max="3" :step="0.01" />
          </div>
        </div>
        <!--  光源照射距离-->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>光源照射距离</el-button>
          </div>
          <div class="grid-sidle">
            <el-slider show-input @input="onChangeSpotLight" v-model="config.spotDistance" :min="1" :max="500" :step="1" />
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, getCurrentInstance } from "vue";
import { useMeshEditStore } from "@/store/meshEditStore";
import { PREDEFINE_COLORS, UPDATE_MODEL } from "@/config/constant";
const store = useMeshEditStore();
const { $bus } = getCurrentInstance().proxy;
const config = reactive({
  //环境光
  ambientLight: true,
  ambientLightColor: "#fff",
  ambientLightIntensity: 0.8,
  //平行光
  directionalLight: false,
  directionalLightHelper: true,
  directionalLightColor: "#fff",
  directionalLightIntensity: 5,
  directionalHorizontal: -1.26,
  directionalVertical: -3.85,
  directionalSistine: 2.98,
  directionShadow: true,
  //点光源
  pointLight: false,
  pointLightHelper: true,
  pointLightColor: "#1E90FF",
  pointLightIntensity: 10,
  pointHorizontal: -4.21,
  pointVertical: -4.1,
  pointDistance: 2.53,
  //聚光灯
  spotLight: false,
  spotLightColor: "#00BABD",
  spotLightIntensity: 900,
  spotHorizontal: -3.49,
  spotVertical: -4.37,
  spotSistine: 4.09,
  spotAngle: 0.5,
  spotPenumbra: 1,
  spotFocus: 1,
  spotCastShadow: true,
  spotLightHelper: true,
  spotDistance: 20
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
const pointDisabled = computed(() => {
  const { pointLight } = config;
  return pointLight ? "" : "disabled";
});
const spotDisabled = computed(() => {
  const { spotLight } = config;
  return spotLight ? "" : "disabled";
});

const state = reactive({
  modelApi: computed(() => store.modelApi)
});

onMounted(() => {
  $bus.on(UPDATE_MODEL, () => {
    initLightData();
  });
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
};

const changePointLightColor = pointLightColor => {
  config.pointLightColor = pointLightColor;
  state.modelApi.onSetModelPointLight(config);
};

// 设置点光源
const onChangePointLight = () => {
  state.modelApi.onSetModelPointLight(config);
};

// 设置聚颜色
const changeSpotLightColor = spotLightColor => {
  config.spotLightColor = spotLightColor;
  state.modelApi.onSetModelSpotLight(config);
};
// 设置聚光灯
const onChangeSpotLight = () => {
  state.modelApi.onSetModelSpotLight(config);
};

const initLightData = () => {
  Object.assign(config, {
    //环境光
    ambientLight: true,
    ambientLightColor: "#fff",
    ambientLightIntensity: 0.8,
    //平行光
    directionalLight: false,
    directionalLightHelper: true,
    directionalLightColor: "#fff",
    directionalLightIntensity: 5,
    directionalHorizontal: -1.26,
    directionalVertical: -3.85,
    directionalSistine: 2.98,
    directionShadow: true,
    //点光源
    pointLight: false,
    pointLightHelper: true,
    pointLightColor: "#1E90FF",
    pointLightIntensity: 10,
    pointHorizontal: -4.21,
    pointVertical: -4.1,
    pointDistance: 2.53,
    //聚光灯
    spotLight: false,
    spotLightColor: "#00BABD",
    spotLightIntensity: 900,
    spotHorizontal: -3.49,
    spotVertical: -4.37,
    spotSistine: 4.09,
    spotAngle: 0.5,
    spotPenumbra: 1,
    spotFocus: 1,
    spotCastShadow: true,
    spotLightHelper: true,
    spotDistance: 20
  });
};

const onInitialize = () => {
  initLightData();
  state.modelApi.onResettingLight({ ambientLight: true });
};

defineExpose({
  config
});
</script>

<style scoped lang="scss">
.edit-box {
  height: auto;
}
.silder {
  width: 270px;
  padding-left: 12px;
}
.anambient-img {
  padding: 0 10px;
  ul {
    display: flex;
    flex-wrap: wrap;
  }
  .anambient-active {
    box-sizing: border-box;
    border: 2px solid #4d57fd;
  }
  li {
    position: relative;
    margin: 0 4px;
    cursor: pointer;
  }
}
</style>
