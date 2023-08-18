<template>
  <div class="edit-box">
    <div class="header">
      <span>模型属性</span>
      <el-switch v-model="config.visible" @change="onChangeAttributeSwitch" />
    </div>
    <!-- 模型旋转 -->
    <div class="options" :class="optionDisabled">
      <div class="option space-between">
        <el-space>
          <el-icon>
            <Setting />
          </el-icon>
          <span> 模型轴旋转 </span>
        </el-space>
        <el-button type="primary" link icon="Refresh" @click="onResultRotate">
          重置
        </el-button>
      </div>
      <div class="option">
        <el-button
          type="info"
          icon="RefreshRight"
          @click="onSetRotateOnAxis('x', 'right')"
        />
        <el-button type="primary" link>X轴</el-button>
        <el-button
          type="info"
          icon="RefreshLeft"
          @click="onSetRotateOnAxis('x', 'left')"
        />
      </div>
      <div class="option">
        <el-button
          type="info"
          icon="RefreshRight"
          @click="onSetRotateOnAxis('y', 'right')"
        />
        <el-button type="primary" link>Y轴</el-button>
        <el-button
          type="info"
          icon="RefreshLeft"
          @click="onSetRotateOnAxis('y', 'left')"
        />
      </div>
      <div class="option">
        <el-button
          type="info"
          icon="RefreshRight"
          @click="onSetRotateOnAxis('z', 'right')"
        />
        <el-button type="primary" link>Z轴</el-button>
        <el-button
          type="info"
          icon="RefreshLeft"
          @click="onSetRotateOnAxis('z', 'left')"
        />
      </div>
      <!-- 模型位置 -->
      <div class="option space-between">
        <el-space>
          <el-icon>
            <Location />
          </el-icon>
          <span> 模型位置 </span>
        </el-space>
        <el-button type="primary" link icon="Refresh" @click="onResultPosition">
          重置
        </el-button>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>X 轴</el-button>
        </div>
        <div class="grid-silder">
          <el-slider
            @change="onSetPosition"
            show-input
            v-model="config.positionX"
            :min="-10"
            :max="10"
            :step="0.1"
          />
        </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>Y 轴</el-button>
        </div>
        <div class="grid-silder">
          <el-slider
            @change="onSetPosition"
            show-input
            v-model="config.positionY"
            :min="-10"
            :max="10"
            :step="0.1"
          />
        </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>Z 轴</el-button>
        </div>
        <div class="grid-silder">
          <el-slider
            @change="onSetPosition"
            show-input
            v-model="config.positionZ"
            :min="-10"
            :max="10"
            :step="0.1"
          />
        </div>
      </div>
      <!-- 模型骨架 -->
      <div class="option space-between">
        <el-space>
          <el-icon>
            <Eleme />
          </el-icon>
          <span> 模型骨架 </span>
        </el-space>
        <el-switch v-model="config.skeletonHelper" @change="onSetModelHelper" />
      </div>
    </div>
    <!-- 网格辅助线 -->
    <div class="options" :class="optionDisabled">
      <div class="option space-between">
        <el-space>
          <el-icon>
            <Grid />
          </el-icon>
          <span> 网格辅助线 </span>
        </el-space>
        <el-switch v-model="config.gridHelper" @change="onChangeGridHelper" />
      </div>
    </div>
    <div class="options" :class="gridDisabled">
      <!-- x轴 -->
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>X 轴</el-button>
        </div>
        <div class="grid-silder">
          <el-slider
            show-input
            @change="onChangeGridHelper"
            v-model="config.x"
            :min="-2"
            :max="2"
            :step="0.01"
          />
        </div>
      </div>
      <!-- Y轴 -->
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>Y 轴</el-button>
        </div>
        <div class="grid-silder">
          <el-slider
            show-input
            @change="onChangeGridHelper"
            v-model="config.y"
            :min="-2"
            :max="2"
            :step="0.01"
          />
        </div>
      </div>
      <!-- Z轴 -->
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>Z 轴</el-button>
        </div>
        <div class="grid-silder">
          <el-slider
            show-input
            @change="onChangeGridHelper"
            v-model="config.z"
            :min="-2"
            :max="2"
            :step="0.01"
          />
        </div>
      </div>
      <!-- 网格数量/大小 -->
      <div class="option">
        <div>
          <el-button type="primary" link>大小</el-button>
          <el-input-number
            :controls="true"
            @change="onChangeGridHelperSize"
            v-model="config.size"
            :min="1"
            :max="40"
          />
        </div>
        <div>
          <el-button type="primary" link>分割数</el-button>
          <el-input-number
            :controls="true"
            @change="onChangeGridHelperSize"
            v-model="config.divisions"
            :min="1"
            :max="40"
          />
        </div>
      </div>
      <!-- 网格颜色 -->
      <div class="option">
        <el-space>
          <el-button type="primary" link>网格颜色</el-button>
          <el-color-picker
            color-format="hex"
            :predefine="predefineColors"
            @change="onChangeGridHelper"
            @active-change="activeChangeColor"
            v-model="config.color"
          />
        </el-space>
      </div>
    </div>
    <!-- 坐标轴辅助线 -->
    <div class="options" :class="optionDisabled">
      <div class="option space-between">
        <el-space>
          <el-icon>
            <Rank />
          </el-icon>
          <span> 坐标轴辅助线 </span>
        </el-space>
        <el-switch v-model="config.axesHelper" @change="onChangeAxesHelper" />
      </div>
      <div class="option" :class="axesDisabled">
        <div class="grid-txt">
          <el-button type="primary" link>轴长度</el-button>
        </div>
        <div class="grid-silder">
          <el-slider
            @change="onChangeAxesHelper"
            v-model="config.axesSize"
            :min="1"
            :max="10"
            :step="0.2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance } from "vue";
import { throttle } from "@/utils/utilityFunction";
import { PREDEFINE_COLORS } from "@/config/constant";
import { useStore } from "vuex";
const store = useStore();
const { $bus } = getCurrentInstance().proxy;
const config = reactive({
  visible: true,
  skeletonHelper: false,
  gridHelper: false,
  x: 0,
  y: -0.59,
  z: -0.1,
  positionX: 0,
  positionY: -0.5,
  positionZ: 0,
  divisions: 10,
  size: 4,
  color: "rgb(193,193,193)",
  axesHelper: false,
  axesSize: 1.8,
});
const predefineColors = PREDEFINE_COLORS;
const optionDisabled = computed(() => {
  return config.visible ? "" : "disabled";
});
const gridDisabled = computed(() => {
  const { visible, gridHelper } = config;
  return gridHelper && visible ? "" : "disabled";
});
const axesDisabled = computed(() => {
  const { visible, axesHelper } = config;
  return axesHelper && visible ? "" : "disabled";
});
const state = reactive({
  modelApi: computed(() => {
    return store.state.modelApi;
  }),
});
onMounted(() => {
  $bus.on("model-update", () => {
    // 重置动画数据
    Object.assign(config, {
      skeletonHelper: false,
      x: 0,
      y: -0.59,
      z: -0.1,
      positionX: 0,
      positionY: -0.5,
      positionZ: 0,
    });
  });
});
const onChangeAttributeSwitch = () => {};
// 设置模型轴角度
const onSetRotateOnAxis = (type, direction) => {
  const flag = direction == "right" ? true : false;
  throttle(() => state.modelApi.onSetModelRotateOnAxis(type, flag), 400);
};
// 重置模型角度
const onResultRotate = () => {
  state.modelApi.onResultModelRotateOnAxis();
};

// 设置模型位置
const onSetPosition = () => {
  state.modelApi.onSetModelPosition(config);
};
// 重置模型位置
const onResultPosition = () => {
  config.positionX = 0;
  config.positionY = -0.5;
  config.positionZ = 0;
  state.modelApi.onResultModelPosition(config);
};

const onSetModelHelper = () => {
  state.modelApi.onSetModelHelper(config.skeletonHelper);
};
const activeChangeColor = (color) => {
  config.color = color;
  state.modelApi.onSetModelGridHelper(config);
};
// 设置网格辅助线位置/颜色
const onChangeGridHelper = () => {
  state.modelApi.onSetModelGridHelper(config);
};
// 设置网格数量大小
const onChangeGridHelperSize = () => {
  state.modelApi.onSetModelGridHelperSize(config);
};

//设置坐标轴辅助线
const onChangeAxesHelper = () => {
  state.modelApi.onSetModelAxesHelper(config);
};

defineExpose({
  config
});
</script>

<style lang="scss">
.grid-style {
  min-width: 110px;
}

.grid-silder {
  flex: 5;
  padding-left: 10px;
}
</style>
