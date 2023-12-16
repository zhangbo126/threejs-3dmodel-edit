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
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>颜色</el-button>
        </div>
        <div class="grid-silder">
          <el-color-picker color-format="hex" :predefine="PREDEFINE_COLORS" @change="onChangeColor"
            @active-change="activeChangeColor" v-model="config.color" />
        </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>强度</el-button>
        </div>
        <div class="grid-silder">
          <el-slider show-input v-model="config.strength" @input="onChangeFlow" :step="0.01" :min="0" :max="8" />
        </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>半径</el-button>
        </div>
        <div class="grid-silder">
          <el-slider show-input v-model="config.radius" @input="onChangeFlow" :step="0.01" :min="0" :max="5" />
        </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>阈值</el-button>
        </div>
        <div class="grid-silder">
          <el-slider show-input v-model="config.threshold" @input="onChangeFlow" :step="0.01" :min="0" :max="1" />
        </div>
      </div>
    </div>
    <!-- 曝光度 -->
    <div class="options">
      <div class="option space-between">
        <el-space>
          <el-icon>
            <Umbrella />
          </el-icon>
          <span> 色调曝光度 </span>
        </el-space>
        <div class="grid-silder">
          <el-slider show-input v-model="config.toneMappingExposure" @input="onChangeFlow" :step="0.01" :min="0.5"
            :max="10" />
        </div>
      </div>
    </div>
    <div class="header">
      <el-space>
        <span>模型操作</span>
        <el-tooltip v-if="decomposeDisable == 'disabled'" effect="dark" content="当前模型不可进行以下操作" placement="top">
          <el-icon>
            <WarnTriangleFilled :size="20" color="#ffb940" />
          </el-icon>
        </el-tooltip>
      </el-space>
    </div>
    <!-- 模型拆分 -->
    <div class="options">
      <div class="option space-between" :class="decomposeDisable">
        <el-space>
          <el-icon>
            <Cpu />
          </el-icon>
          <span> 模型分解 </span>
        </el-space>
        <div class="grid-silder">
          <el-slider show-input v-model="config.decompose" @input="onChangeDecompose" :step="0.01" :min="0" :max="20" />
        </div>
      </div>
      <div class="option" :class="moveDisable">
        <el-space>
          <el-icon>
            <Rank :size="20" />
          </el-icon>
          <span> 模型材质拖拽 </span>
        </el-space>
        <div class="grid-silder">
          <el-switch v-model="config.modelDrag" @change="onChangeDrag" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, computed, getCurrentInstance, onMounted } from "vue";
import { useMeshEditStore } from '@/store/meshEditStore'
import { PREDEFINE_COLORS } from "@/config/constant";

const store = useMeshEditStore();
const { $bus } = (getCurrentInstance() as any).proxy;

const optionsDisable = computed(() => {
  const { glow } = config;
  return glow ? "" : "disabled";
});

const decomposeDisable = computed(() => {
  const modelMaterialList = store.modelApi.modelMaterialList;
  const decomposeMesh = modelMaterialList.filter((v: any) => v.type == "Mesh");
  return (decomposeMesh.length <= 1) || decomposeMesh.length != modelMaterialList.length || config.modelDrag ? "disabled" : "";
});
const moveDisable = computed(() => {
  const modelMaterialList = store.modelApi.modelMaterialList;
  const decomposeMesh = modelMaterialList.filter((v: any) => v.type == "Mesh");
  return decomposeMesh.length <= 1 || decomposeMesh.length != modelMaterialList.length ? "disabled" : "";
});


const config = reactive({
  glow: false,
  threshold: 0.05,
  strength: 0.6,
  radius: 1,
  decompose: 0,
  modelDrag: false,
  toneMappingExposure: 2,
  color: ''
});

onMounted(() => {
  $bus.on("model-update", () => {
    Object.assign(config, {
      glow: false,
      threshold: 0.05,
      strength: 0.6,
      radius: 1,
      decompose: 0,
      modelDrag: false,
      toneMappingExposure: 2,
    });
  });
});

const onChangeColor = () => {
  store.modelApi.onSetFlowColor(config.color);
};
const activeChangeColor = (color: string) => {
  config.color = color
  store.modelApi.onSetFlowColor(config.color);
};

const onChangeFlow = () => {
  store.modelApi.onSetUnrealBloomPass(config);
};

const onChangeDecompose = () => {
  store.modelApi.setModelMeshDecompose(config);
};

const onChangeDrag = () => {
  config.decompose = 0;
  store.modelApi.setModelMeshDecompose(config);
  store.modelApi.setModelMeshDrag(config);
};

const getStageConfig = () => {
  return {
    meshPositonList: store.modelApi.getMeshDragPosition(),
    ...config,
  };
};
defineExpose({
  getStageConfig,
});
</script>
<style lang="scss" scoped></style>
