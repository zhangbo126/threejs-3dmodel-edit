<template>
  <div class="edit-box">
    <div class="header">
      <span>模型灯光</span>
    </div>
    <el-scrollbar height="calc(100vh - 130px)">
       <!-- 模型平面 -->
       <div class="options">
        <div class="option space-between">
          <el-space>
            <el-icon>
              <Odometer />
            </el-icon>
            <span>模型平面</span>
          </el-space>
          <el-switch v-model="config.planeGeometry" @change="onChangePlaneGeometry" />
        </div>
          <div class="option" :class="planetDisabled">
              <el-space>
                <span>平面颜色</span>
                <el-color-picker
                  color-format="hex"
                  v-model="config.planeColor"
                  :predefine="predefineColors"
                  @change="onChangePlaneGeometry"
                  @active-change="changePlaneGeometryColor"
                />
              </el-space>
          </div>
          <div class="option" :class="planetDisabled">
            <div class="grid-txt">
              <el-button type="text">宽度</el-button>
            </div>
            <div class="grid-silder">
              <el-slider
                @change="onChangePlaneGeometry"
                v-model="config.planeWidth"
                :min="0"
                :max="100"
                :step="0.01"
              />
            </div>
          </div>
          <div class="option" :class="planetDisabled">
            <div class="grid-txt">
              <el-button type="text">高度</el-button>
            </div>
            <div class="grid-silder">
              <el-slider
                @change="onChangePlaneGeometry"
                v-model="config.planeHeight"
                :min="0"
                :max="100"
                :step="0.01"
              />
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
              @change="onChangeAmbientLight"
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
            <el-icon><SetUp /></el-icon>
            <span>平行光</span>
          </el-space>
          <el-switch
            v-model="config.directionalLight"
            @change="onChangeDirectionalLight"
          />
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
              @change="onChangeDirectionalLight"
              v-model="config.directionalLightIntensity"
              :min="-5"
              :max="5"
              :step="0.01"
            />
          </div>
        </div>
        <!-- 阴影 -->
        <div class="option" :class="directionaDisabled">
          <div class="grid-txt">
            <el-button type="text">是否开启阴影</el-button>
          </div>
          <div class="grid-silder">
            <el-switch
              v-model="config.directionaShadow"
              @change="onChangeDirectionalLight"
            />
          </div>
        </div>
        <!-- 水平方向 -->
        <div class="option" :class="directionaDisabled">
          <div class="grid-txt">
            <el-button type="text">水平方向</el-button>
          </div>
          <div class="grid-silder">
            <el-slider
              @change="onChangeDirectionalLight"
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
            <el-button type="text">垂直方向</el-button>
          </div>
          <div class="grid-silder">
            <el-slider
              @change="onChangeDirectionalLight"
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
            <el-button type="text">光源距离</el-button>
          </div>
          <div class="grid-silder">
            <el-slider
              @change="onChangeDirectionalLight"
              v-model="config.directionalSistance"
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
            <el-icon><Place /></el-icon>
            <span>点光源</span>
          </el-space>
          <el-switch v-model="config.pointLight" @change="onChangePointLight" />
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
              @change="onChangePointLight"
              v-model="config.pointLightIntensity"
              :min="-15"
              :max="15"
              :step="0.01"
            />
          </div>
        </div>
        <!-- 水平方向 -->
        <div class="option" :class="pointDisabled">
          <div class="grid-txt">
            <el-button type="text">水平方向</el-button>
          </div>
          <div class="grid-silder">
            <el-slider
              @change="onChangePointLight"
              v-model="config.pointHorizontal"
              :min="-10"
              :max="10"
              :step="0.01"
            />
          </div>
        </div>
        <!-- 垂直方向方向 -->
        <div class="option" :class="pointDisabled">
          <div class="grid-txt">
            <el-button type="text">垂直方向</el-button>
          </div>
          <div class="grid-silder">
            <el-slider
              @change="onChangePointLight"
              v-model="config.pointVertical"
              :min="-10"
              :max="10"
              :step="0.01"
            />
          </div>
        </div>
        <!-- 光源距离 -->
        <div class="option" :class="pointDisabled">
          <div class="grid-txt">
            <el-button type="text">光源距离</el-button>
          </div>
          <div class="grid-silder">
            <el-slider
              @change="onChangePointLight"
              v-model="config.pointSistance"
              :min="0"
              :max="10"
              :step="0.01"
            />
          </div>
        </div>
      </div>
      <!-- 聚光灯 -->
      <div class="options">
        <div class="option space-between">
          <el-space>
            <el-icon><Orange /></el-icon>
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
              @change="onChangeSpotLight"
              v-model="config.spotLightIntensity"
              :min="0"
              :max="500"
              :step="0.01"
            />
          </div>
        </div>
        <!-- 阴影 -->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="text">是否开启阴影</el-button>
          </div>
          <div class="grid-silder">
            <el-switch v-model="config.spotCastShadow" @change="onChangeSpotLight" />
          </div>
        </div>
        <!-- 水平方向 -->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="text">水平方向</el-button>
          </div>
          <div class="grid-silder">
            <el-slider
              @change="onChangeSpotLight"
              v-model="config.spotHorizontal"
              :min="-10"
              :max="10"
              :step="0.01"
            />
          </div>
        </div>
        <!-- 垂直方向方向 -->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="text">垂直方向</el-button>
          </div>
          <div class="grid-silder">
            <el-slider
              @change="onChangeSpotLight"
              v-model="config.spotVertical"
              :min="-10"
              :max="10"
              :step="0.01"
            />
          </div>
        </div>
        <!-- 光源距离 -->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="text">光源距离</el-button>
          </div>
          <div class="grid-silder">
            <el-slider
              @change="onChangeSpotLight"
              v-model="config.spotSistance"
              :min="0"
              :max="10"
              :step="0.01"
            />
          </div>
        </div>
        <!-- 光线照射范围 -->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="text">光线照射范围</el-button>
          </div>
          <div class="grid-silder">
            <el-slider
              @change="onChangeSpotLight"
              v-model="config.spotAngle"
              :min="0"
              :max="2"
              :step="0.01"
            />
          </div>
        </div>
        <!-- 边缘聚光度 -->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="text">边缘聚光度</el-button>
          </div>
          <div class="grid-silder">
            <el-slider
              @change="onChangeSpotLight"
              v-model="config.spotPenumbra"
              :min="0"
              :max="1"
              :step="0.01"
            />
          </div>
        </div>
        <!-- 聚光度 强度-->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="text">投影聚焦度</el-button>
          </div>
          <div class="grid-silder">
            <el-slider
              @change="onChangeSpotLight"
              v-model="config.spotFocus"
              :min="0"
              :max="3"
              :step="0.01"
            />
          </div>
        </div>
        <!--  光源照射距离-->
        <div class="option" :class="spotDisabled">
          <div class="grid-txt">
            <el-button type="text">光源照射距离</el-button>
          </div>
          <div class="grid-silder">
            <el-slider
              @change="onChangeSpotLight"
              v-model="config.spotDistance"
              :min="1"
              :max="500"
              :step="1"
            />
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useStore } from "vuex";
import { PREDEFINE_COLORS } from "@/config/constant";
const store = useStore();
const config = reactive({
  //模型平面
  planeGeometry:false,
  planeColor:'#fff',
  planeWidth:7,
  planeHeight:7,
  //环境光
  ambientLight: true,
  ambientLightColor: "#fff",
  ambientLightIntensity: 0.1,
  //平行光
  directionalLight: false,
  directionalLightColor: "#1E90FF",
  directionalLightIntensity: 1,
  directionalHorizontal: -1.26,
  directionalVertical: -3.85,
  directionalSistance: 2.98,
  directionaShadow: true,
  //点光源
  pointLight: false,
  pointLightColor: "#1E90FF",
  pointLightIntensity: 1,
  pointHorizontal: -4.21,
  pointVertical: -4.1,
  pointSistance: 2.53,
  //聚光灯
  spotLight: false,
  spotLightColor: "#0F1B1A",
  spotLightIntensity: 30,
  spotHorizontal: -3.49,
  spotVertical: -4.37,
  spotSistance: 4.09,
  spotAngle: 0.5,
  spotPenumbra: 1,
  spotFocus: 1,
  spotCastShadow: true,
  spotDistance:20
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

const state = reactive({
  modelApi: computed(() => {
    return store.state.modelApi;
  }),
});
const changeAmbientLightColor = (ambientLightColor) => {
  config.ambientLightColor = ambientLightColor;
  state.modelApi.onSetModelAmbientLight(config);
};

// 设置环境光
const onChangeAmbientLight = () => {
  state.modelApi.onSetModelAmbientLight(config);
};

const changeDirectionalLightColor = (directionalLightColor) => {
  config.directionalLightColor = directionalLightColor;
  state.modelApi.onSetModelDirectionalLight(config);
};

// 设置平行光
const onChangeDirectionalLight = () => {
  if(config.directionalLight){
     config.planeGeometry=true
     state.modelApi.onSetModelPlaneGeometry(config);
  }
  state.modelApi.onSetModelDirectionalLight(config);
};

const changePointLightColor = (pointLightColor) => {
  config.pointLightColor = pointLightColor;
  state.modelApi.onSetModelPointLight(config);
};

// 设置点光源
const onChangePointLight = () => {
  state.modelApi.onSetModelPointLight(config);
};

// 设置聚颜色
const changeSpotLightColor = (spotLightColor) => {
  config.spotLightColor = spotLightColor;
  state.modelApi.onSetModelSpotLight(config);
};
// 设置聚光灯
const onChangeSpotLight = () => {
  if(config.spotLight){
     config.planeGeometry=true
     state.modelApi.onSetModelPlaneGeometry(config);
  }
  state.modelApi.onSetModelSpotLight(config);
};

const changePlaneGeometryColor=(planeColor)=>{
  config.planeColor = planeColor;
  state.modelApi.onSetModelPlaneGeometry(config);

}
// 设置模型平面
const onChangePlaneGeometry = () => {
  state.modelApi.onSetModelPlaneGeometry(config);
};
</script>

<style scoped lang="scss">
.edit-box {
  height: auto;
}
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
}
</style>
