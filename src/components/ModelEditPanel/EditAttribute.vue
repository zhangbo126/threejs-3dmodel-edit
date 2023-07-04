<template>
  <div class="edit-box">
    <div class="header">
      <span>模型属性</span>
      <el-switch v-model="config.visible" @change="onChangeAttributeSwitch" />
    </div>
    <!-- 模型旋转 -->
    <div class="options" :class="optionDisabled">
      <div class="option" :style="{ justifyContent: 'space-between' }">
        <el-space>
          <el-icon><Setting /></el-icon>
          <span> 模型轴旋转 </span>
        </el-space>
        <el-button type="text" icon="Refresh" @click="onResultRotate"> 重置 </el-button>
      </div>
      <div class="option">
        <el-button
          type="info"
          icon="RefreshRight"
          @click="onSetRotateOnAxis('x', 'right')"
        />
        <el-button type="text">X轴</el-button>
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
        <el-button type="text">Y轴</el-button>
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
        <el-button type="text">Z轴</el-button>
        <el-button
          type="info"
          icon="RefreshLeft"
          @click="onSetRotateOnAxis('z', 'left')"
        />
      </div>
      <div class="option" :style="{ justifyContent: 'space-between' }">
        <el-space>
          <el-icon><Eleme /></el-icon>
          <span> 模型骨架 </span>
        </el-space>
        <el-switch v-model="config.skeletonHelper" @change="onSetModelHelper" />
      </div>
    </div>
    <!-- 网格辅助线 -->
    <div class="options" :class="optionDisabled">
      <div class="option" :style="{ justifyContent: 'space-between' }">
        <el-space>
          <el-icon><Grid /></el-icon>
          <span> 网格辅助线 </span>
        </el-space>
        <el-switch v-model="config.gridHelper" @change="onChangeGridHelper" />
      </div>
    </div>
    <div class="options" :class="gridDisabled">
      <!-- x轴 -->
      <div class="option">
        <div class="grid-txt">
          <el-button type="text">X轴</el-button>
        </div>
        <div class="grid-silder">
          <el-slider
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
          <el-button type="text">Y轴</el-button>
        </div>
        <div class="grid-silder">
          <el-slider
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
          <el-button type="text">Z轴</el-button>
        </div>
        <div class="grid-silder">
          <el-slider
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
          <el-button type="text">大小</el-button>
          <el-input-number
            :controls="true"
            @change="onChangeGridHelperSize"
            v-model="config.size"
            :min="1"
            :max="40"
          />
        </div>
        <div>
          <el-button type="text">分割数</el-button>
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
          <el-button type="text">网格颜色</el-button>
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
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { throttle } from "@/utils/utilityFunction";
import { PREDEFINE_COLORS } from "@/config/constant";
import { useStore } from "vuex";
const store = useStore();
const config = reactive({
  visible: true,
  skeletonHelper: false,
  gridHelper: false,
  x: 0,
  y: -0.2,
  z: -0.1,
  divisions: 10,
  size: 4,
  color: "#1395E6",
});
const predefineColors = PREDEFINE_COLORS;
const optionDisabled = computed(() => {
  return config.visible ? "" : "disabled";
});
const gridDisabled = computed(() => {
  const { visible, gridHelper } = config;
  return gridHelper && visible ? "" : "disabled";
});
const state = reactive({
  modelApi: computed(() => {
    return store.state.modelApi;
  }),
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
