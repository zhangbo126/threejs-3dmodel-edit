<template>
  <div class="edit-box">
    <div class="header">
      <span>模型灯光</span>
    </div>
    <el-scrollbar height="calc(100vh - 130px)">
      <!-- 光源平面 -->
      <div class="options">
        <div class="option space-between">
          <el-space>
            <el-icon>
              <Odometer />
            </el-icon>
            <span>光源平面</span>
          </el-space>
          <el-switch v-model="config.planeGeometry" @change="onChangePlaneGeometry" />
        </div>
        <div class="option" :class="planetDisabled">
          <el-space>
            <span>平面颜色</span>
            <el-color-picker color-format="hex" v-model="config.planeColor" :predefine="predefineColors"
              @change="onChangePlaneGeometry" @active-change="changePlaneGeometryColor" />
          </el-space>
        </div>
        <div class="option" :class="planetDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>宽度</el-button>
          </div>
          <div class="grid-silder">
            <el-slider show-input @input="onChangePlaneGeometry" v-model="config.planeWidth" :min="0" :max="100"
              :step="0.1" />
          </div>
        </div>
        <div class="option" :class="planetDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>高度</el-button>
          </div>
          <div class="grid-silder">
            <el-slider show-input @input="onChangePlaneGeometry" v-model="config.planeHeight" :min="0" :max="100"
              :step="0.1" />
          </div>
        </div>
      </div>
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
            <el-color-picker color-format="hex" v-model="config.ambientLightColor" :predefine="predefineColors"
              @change="onChangeAmbientLight" @active-change="changeAmbientLightColor" />
          </div>
          <div class="silder">
            <el-slider show-input @input="onChangeAmbientLight" v-model="config.ambientLightIntensity" :min="-5" :max="5"
              :step="0.01" />
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
            <el-color-picker color-format="hex" v-model="config.directionalLightColor" :predefine="predefineColors"
              @change="onChangeDirectionalLight" @active-change="changeDirectionalLightColor" />
          </div>
          <div class="silder">
            <el-slider show-input @input="onChangeDirectionalLight" v-model="config.directionalLightIntensity" :min="-5"
              :max="15" :step="0.01" />
          </div>
        </div>
        <div class="option" :class="directionaDisabled">
          <!-- 阴影 -->
          <div class="grid-txt">
            <el-button type="primary" link>是否开启阴影</el-button>
          </div>
          <div class="grid-silder">
            <el-switch v-model="config.directionaShadow" @change="onChangeDirectionalLight" />
          </div>
          <!-- 辅助线 -->
          <el-space>
            <div class="grid-txt">
              <el-button type="primary" link>辅助线</el-button>
            </div>
            <div class="grid-silder">
              <el-switch v-model="config.directionalLightHelper" @change="onChangeDirectionalLight" />
            </div>
          </el-space>
        </div>
        <!-- 水平方向 -->
        <div class="option" :class="directionaDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>水平方向</el-button>
          </div>
          <div class="grid-silder">
            <el-slider show-input @input="onChangeDirectionalLight" v-model="config.directionalHorizontal" :min="-10"
              :max="10" :step="0.01" />
          </div>
        </div>
        <!-- 垂直方向方向 -->
        <div class="option" :class="directionaDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>垂直方向</el-button>
          </div>
          <div class="grid-silder">
            <el-slider show-input @input="onChangeDirectionalLight" v-model="config.directionalVertical" :min="-10"
              :max="10" :step="0.01" />
          </div>
        </div>
        <!-- 光源距离 -->
        <div class="option" :class="directionaDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>光源距离</el-button>
          </div>
          <div class="grid-silder">
            <el-slider show-input @input="onChangeDirectionalLight" v-model="config.directionalSistance" :min="0"
              :max="10" :step="0.01" />
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
            <div class="grid-silder">
              <el-switch v-model="config.pointLightHelper" @change="onChangePointLight" />
            </div>
          </el-space>
        </div>
        <div class="option" :class="pointDisabled">
          <div class="color">
            <el-color-picker color-format="hex" v-model="config.pointLightColor" :predefine="predefineColors"
              @change="onChangePointLight" @active-change="changePointLightColor" />
          </div>
          <div class="silder">
            <el-slider show-input @input="onChangePointLight" v-model="config.pointLightIntensity" :min="-20" :max="60"
              :step="0.1" />
          </div>
        </div>
        <!-- 水平方向 -->
        <div class="option" :class="pointDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>水平方向</el-button>
          </div>
          <div class="grid-silder">
            <el-slider show-input @input="onChangePointLight" v-model="config.pointHorizontal" :min="-10" :max="10"
              :step="0.11" />
          </div>
        </div>
        <!-- 垂直方向方向 -->
        <div class="option" :class="pointDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>垂直方向</el-button>
          </div>
          <div class="grid-silder">
            <el-slider show-input @input="onChangePointLight" v-model="config.pointVertical" :min="-10" :max="10"
              :step="0.1" />
          </div>
        </div>
        <!-- 光源距离 -->
        <div class="option" :class="pointDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>光源距离</el-button>
          </div>
          <div class="grid-silder">
            <el-slider show-input @input="onChangePointLight" v-model="config.pointSistance" :min="0" :max="10"
              :step="0.1" />
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
            <el-color-picker color-format="hex" v-model="config.spotLightColor" :predefine="predefineColors"
              @change="onChangeSpotLight" @active-change="changeSpotLightColor" />
          </div>
          <div class="silder">
            <el-slider show-input @input="onChangeSpotLight" v-model="config.spotLightIntensity" :min="0" :max="2000"
              :step="0.1" />
          </div>
        </div>
        <!-- 阴影 -->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>是否开启阴影</el-button>
          </div>
          <div class="grid-silder">
            <el-switch v-model="config.spotCastShadow" @change="onChangeSpotLight" />
          </div>
          <!-- 辅助线 -->
          <el-space>
            <div class="grid-txt">
              <el-button type="primary" link>辅助线</el-button>
            </div>
            <div class="grid-silder">
              <el-switch v-model="config.spotLightHelper" @change="onChangeSpotLight" />
            </div>
          </el-space>
        </div>
        <!-- 水平方向 -->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>水平方向</el-button>
          </div>
          <div class="grid-silder">
            <el-slider show-input @input="onChangeSpotLight" v-model="config.spotHorizontal" :min="-10" :max="10"
              :step="0.1" />
          </div>
        </div>
        <!-- 垂直方向方向 -->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>垂直方向</el-button>
          </div>
          <div class="grid-silder">
            <el-slider show-input @input="onChangeSpotLight" v-model="config.spotVertical" :min="-10" :max="10"
              :step="0.1" />
          </div>
        </div>
        <!-- 光源距离 -->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>光源距离</el-button>
          </div>
          <div class="grid-silder">
            <el-slider show-input @input="onChangeSpotLight" v-model="config.spotSistance" :min="0" :max="10"
              :step="0.1" />
          </div>
        </div>
        <!-- 光线照射范围 -->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>光线照射范围</el-button>
          </div>
          <div class="grid-silder">
            <el-slider show-input @input="onChangeSpotLight" v-model="config.spotAngle" :min="0" :max="2" :step="0.01" />
          </div>
        </div>
        <!-- 边缘聚光度 -->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>边缘聚光度</el-button>
          </div>
          <div class="grid-silder">
            <el-slider show-input @input="onChangeSpotLight" v-model="config.spotPenumbra" :min="0" :max="1"
              :step="0.01" />
          </div>
        </div>
        <!-- 聚光度 强度-->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>投影聚焦度</el-button>
          </div>
          <div class="grid-silder">
            <el-slider show-input @input="onChangeSpotLight" v-model="config.spotFocus" :min="0" :max="3" :step="0.01" />
          </div>
        </div>
        <!--  光源照射距离-->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="primary" link>光源照射距离</el-button>
          </div>
          <div class="grid-silder">
            <el-slider show-input @input="onChangeSpotLight" v-model="config.spotDistance" :min="1" :max="500"
              :step="1" />
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, getCurrentInstance } from "vue";
import { useMeshEditStore } from '@/store/meshEditStore'
import { PREDEFINE_COLORS } from "@/config/constant";
const store = useMeshEditStore();
const { $bus } = (getCurrentInstance() as any).proxy;
const config = reactive({
  //光源平面
  planeGeometry: false,
  planeColor: "#000000",
  planeWidth: 7,
  planeHeight: 7,
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
  directionalSistance: 2.98,
  directionaShadow: true,
  //点光源
  pointLight: false,
  pointLightHelper: true,
  pointLightColor: "#1E90FF",
  pointLightIntensity: 10,
  pointHorizontal: -4.21,
  pointVertical: -4.1,
  pointSistance: 2.53,
  //聚光灯
  spotLight: false,
  spotLightColor: "#00BABD",
  spotLightIntensity: 900,
  spotHorizontal: -3.49,
  spotVertical: -4.37,
  spotSistance: 4.09,
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
const planetDisabled = computed(() => {
  const { planeGeometry } = config;
  return planeGeometry ? "" : "disabled";
});



onMounted(() => {
  $bus.on("model-update", () => {
    Object.assign(config, {
      //光源平面
      planeGeometry: false,
      planeColor: "#000000",
      planeWidth: 7,
      planeHeight: 7,
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
      directionalSistance: 2.98,
      directionaShadow: true,
      //点光源
      pointLight: false,
      pointLightHelper: true,
      pointLightColor: "#1E90FF",
      pointLightIntensity: 10,
      pointHorizontal: -4.21,
      pointVertical: -4.1,
      pointSistance: 2.53,
      //聚光灯
      spotLight: false,
      spotLightColor: "#00BABD",
      spotLightIntensity: 900,
      spotHorizontal: -3.49,
      spotVertical: -4.37,
      spotSistance: 4.09,
      spotAngle: 0.5,
      spotPenumbra: 1,
      spotFocus: 1,
      spotCastShadow: true,
      spotLightHelper: true,
      spotDistance: 20
    });
  });
});

const changeAmbientLightColor = (ambientLightColor: string) => {
  config.ambientLightColor = ambientLightColor;
  store.modelApi.onSetModelAmbientLight(config);
};

// 设置环境光
const onChangeAmbientLight = () => {
  store.modelApi.onSetModelAmbientLight(config);
};

const changeDirectionalLightColor = (directionalLightColor: string) => {
  config.directionalLightColor = directionalLightColor;
  store.modelApi.onSetModelDirectionalLight(config);
};

// 设置平行光
const onChangeDirectionalLight = () => {
  if (config.directionalLight) {
    config.planeGeometry = true;
    store.modelApi.onSetModelPlaneGeometry(config);
  }
  store.modelApi.onSetModelDirectionalLight(config);
};

const changePointLightColor = (pointLightColor: string) => {
  config.pointLightColor = pointLightColor;
  store.modelApi.onSetModelPointLight(config);
};

// 设置点光源
const onChangePointLight = () => {
  store.modelApi.onSetModelPointLight(config);
};

// 设置聚颜色
const changeSpotLightColor = (spotLightColor: string) => {
  config.spotLightColor = spotLightColor;
  store.modelApi.onSetModelSpotLight(config);
};
// 设置聚光灯
const onChangeSpotLight = () => {
  if (config.spotLight) {
    config.planeGeometry = true;
    store.modelApi.onSetModelPlaneGeometry(config);
  }
  store.modelApi.onSetModelSpotLight(config);
};

const changePlaneGeometryColor = (planeColor: string) => {
  config.planeColor = planeColor;
  store.modelApi.onSetModelPlaneGeometry(config);
};
// 设置模型平面
const onChangePlaneGeometry = () => {
  store.modelApi.onSetModelPlaneGeometry(config);
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
}</style>
