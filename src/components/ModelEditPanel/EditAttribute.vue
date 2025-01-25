<template>
  <div class="edit-box">
    <div class="header">
      <span>辅助线/轴配置</span>
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
        <el-button type="primary" link icon="Refresh" @click="onResultRotate"> 重置 </el-button>
      </div>
      <div class="option">
        <el-button type="info" icon="RefreshRight" @click="onSetRotateOnAxis('x', 'right')" />
        <el-button type="primary" link>X轴</el-button>
        <el-button type="info" icon="RefreshLeft" @click="onSetRotateOnAxis('x', 'left')" />
      </div>
      <div class="option">
        <el-button type="info" icon="RefreshRight" @click="onSetRotateOnAxis('y', 'right')" />
        <el-button type="primary" link>Y轴</el-button>
        <el-button type="info" icon="RefreshLeft" @click="onSetRotateOnAxis('y', 'left')" />
      </div>
      <div class="option">
        <el-button type="info" icon="RefreshRight" @click="onSetRotateOnAxis('z', 'right')" />
        <el-button type="primary" link>Z轴</el-button>
        <el-button type="info" icon="RefreshLeft" @click="onSetRotateOnAxis('z', 'left')" />
      </div>
      <!-- 模型位置 -->
      <div class="option space-between">
        <el-space>
          <el-icon>
            <Location />
          </el-icon>
          <span> 模型位置 </span>
        </el-space>
        <el-button type="primary" link icon="Refresh" @click="onResultPosition"> 重置 </el-button>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>X 轴</el-button>
        </div>
        <div class="grid-sidle">
          <el-slider @input="onSetPosition" show-input v-model="config.positionX" :min="-10" :max="10" :step="0.1" />
        </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>Y 轴</el-button>
        </div>
        <div class="grid-sidle">
          <el-slider @input="onSetPosition" show-input v-model="config.positionY" :min="-10" :max="10" :step="0.1" />
        </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>Z 轴</el-button>
        </div>
        <div class="grid-sidle">
          <el-slider @input="onSetPosition" show-input v-model="config.positionZ" :min="-10" :max="10" :step="0.1" />
        </div>
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
        <div class="grid-sidle">
          <el-slider show-input @input="onChangeGridHelper" v-model="config.x" :min="-2" :max="4" :step="0.01" />
        </div>
      </div>
      <!-- Y轴 -->
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>Y 轴</el-button>
        </div>
        <div class="grid-sidle">
          <el-slider show-input @input="onChangeGridHelper" v-model="config.y" :min="-2" :max="4" :step="0.01" />
        </div>
      </div>
      <!-- Z轴 -->
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>Z 轴</el-button>
        </div>
        <div class="grid-sidle">
          <el-slider show-input @input="onChangeGridHelper" v-model="config.z" :min="-2" :max="4" :step="0.01" />
        </div>
      </div>
      <!-- 网格数量/大小 -->
      <div class="option">
        <div>
          <el-button type="primary" link>大小</el-button>
          <el-input-number :controls="true" @change="onChangeGridHelperSize" v-model="config.size" :min="1" :max="40" />
        </div>
        <div>
          <el-button type="primary" link>分割数</el-button>
          <el-input-number :controls="true" @change="onChangeGridHelperSize" v-model="config.divisions" :min="1" :max="40" />
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
        <div class="grid-sidle">
          <el-slider @input="onChangeAxesHelper" v-model="config.axesSize" :min="1" :max="10" :step="0.2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, getCurrentInstance } from "vue";
import { PREDEFINE_COLORS, UPDATE_MODEL } from "@/config/constant";
import { useMeshEditStore } from "@/store/meshEditStore";
const store = useMeshEditStore();
const { $bus } = getCurrentInstance().proxy;
const config = reactive({
  visible: true,
  gridHelper: false,
  x: 0,
  y: -0.59,
  z: -0.1,
  positionX: 0,
  positionY: -1,
  positionZ: 0,
  divisions: 18,
  size: 6,
  color: "rgb(193,193,193)",
  axesHelper: false,
  axesSize: 1.8
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

onMounted(() => {
  $bus.on(UPDATE_MODEL, () => {
    // 重置动画数据
    Object.assign(config, {
      visible: true,
      gridHelper: false,
      x: 0,
      y: -0.59,
      z: -0.1,
      positionX: 0,
      positionY: -1,
      positionZ: 0,
      divisions: 18,
      size: 6,
      color: "rgb(193,193,193)",
      axesHelper: false,
      axesSize: 1.8
    });
  });
});
const onChangeAttributeSwitch = () => {};
// 设置模型轴角度
const onSetRotateOnAxis = (type, direction) => {
  const flag = direction == "right" ? true : false;
  store.modelApi.onSetModelRotateOnAxis(type, flag);
};

// 重置模型轴位置
const onResultRotate = () => {
  store.modelApi.onResultModelRotateOnAxis();
};

// 设置模型位置
const onSetPosition = () => {
  store.modelApi.onSetModelPosition(config);
};
// 重置模型位置
const onResultPosition = () => {
  config.positionX = 0;
  config.positionY = -1;
  config.positionZ = 0;
  store.modelApi.onResultModelPosition(config);
};

const activeChangeColor = color => {
  config.color = color;
  store.modelApi.onSetModelGridHelper(config);
};
// 设置网格辅助线位置/颜色
const onChangeGridHelper = () => {
  store.modelApi.onSetModelGridHelper(config);
};
// 设置网格数量大小
const onChangeGridHelperSize = () => {
  store.modelApi.onSetModelGridHelperSize(config);
};

//设置坐标轴辅助线
const onChangeAxesHelper = () => {
  store.modelApi.onSetModelAxesHelper(config);
};
const getAttributeConfig = () => {
  const { x, y, z } = store.modelApi.model.rotation;
  let rotationX = x;
  let rotationY = y;
  let rotationZ = z;
  return {
    ...config,
    rotationX,
    rotationY,
    rotationZ
  };
};
defineExpose({
  getAttributeConfig
});
</script>

<style lang="scss" scoped></style>
