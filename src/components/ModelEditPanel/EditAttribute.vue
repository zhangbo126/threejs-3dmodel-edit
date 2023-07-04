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
          <span> 模型轴旋转 </span>
        </el-space>
        <el-button type="text" icon="Refresh" @click="onResultRotate">
          重置
        </el-button>
      </div>
      <div class="option">
        <el-button type="info" icon="RefreshRight" @click="onSetRotateOnAxis('x', 'right')" />
        <el-button type="text">X轴</el-button>
        <el-button type="info" icon="RefreshLeft" @click="onSetRotateOnAxis('x', 'left')" />
      </div>
      <div class="option">
        <el-button type="info" icon="RefreshRight" @click="onSetRotateOnAxis('y', 'right')" />
        <el-button type="text">Y轴</el-button>
        <el-button type="info" icon="RefreshLeft" @click="onSetRotateOnAxis('y', 'left')" />
      </div>
      <div class="option">
        <el-button type="info" icon="RefreshRight" @click="onSetRotateOnAxis('z', 'right')" />
        <el-button type="text">Z轴</el-button>
        <el-button type="info" icon="RefreshLeft" @click="onSetRotateOnAxis('z', 'left')" />
      </div>
      <div class="option">
        <el-space>
          <el-icon><Eleme /></el-icon>
          <span> 模型骨架 </span>
        </el-space>
      </div>
      <div class="option">
        <el-switch v-model="config.skeletonHelper" @change="onSetModelHelper" />
      </div>
      <div class="option">
        <el-space>
          <el-icon><Grid /></el-icon>
          <span> 网格辅助线 </span>
        </el-space>
      </div>
      <div class="option">
        <el-switch v-model="config.gridHelper" @change="onSetGridHelper" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { throttle } from '@/utils/utilityFunction'
import { useStore } from "vuex";
const store = useStore();
const config = reactive({
  visible: true,
  skeletonHelper:false,
  gridHelper:false,
});
const optionDisabled = computed(() => {
  return config.visible ? "" : "disabled";
});
const state = reactive({
  modelApi: computed(() => {
    return store.state.modelApi;
  }),
});
const onChangeAttributeSwitch = () => {

}
// 设置模型轴角度
const onSetRotateOnAxis = (type, direction) => {
  const flag = direction == 'right' ? true : false
  throttle(()=>state.modelApi.onSetModelRotateOnAxis(type, flag),400)
}

// 重置模型角度
const onResultRotate = () => {
  state.modelApi.onResultModelRotateOnAxis()
}
const onSetModelHelper = () => {
  state.modelApi.onSetModelHelper(config.skeletonHelper);
};
const onSetGridHelper = () => {
  state.modelApi.onSetModelGridHelper(config.gridHelper);
};
</script>

<style lang="scss"></style>