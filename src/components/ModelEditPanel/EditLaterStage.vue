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
          <el-button type="primary" link>强度</el-button>
        </div>
        <div class="grid-silder">
          <el-slider
            show-input
            v-model="config.strength"
            @change="onChangeFlow"
            :step="0.01"
            :min="0"
            :max="3"
          />
        </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>半径</el-button>
        </div>
        <div class="grid-silder">
          <el-slider
            show-input
            v-model="config.radius"
            @change="onChangeFlow"
            :step="0.01"
            :min="0"
            :max="2"
          />
        </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>阈值</el-button>
        </div>
        <div class="grid-silder">
          <el-slider
            show-input
            v-model="config.threshold"
            @change="onChangeFlow"
            :step="0.01"
            :min="0"
            :max="1"
          />
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
          <el-slider
            show-input
            v-model="config.toneMappingExposure"
            @change="onChangeFlow"
            :step="0.01"
            :min="0.5"
            :max="10"
          />
        </div>
      </div>
    </div>
    <div class="header">
      <span>模型操作</span>
    </div>
    <!-- 模型拆分 -->
    <div class="options">
      <div class="option space-between">
        <el-space>
          <el-tooltip
            v-if="decomposeDisable == 'disabled'"
            effect="dark"
            content="当前模型不可拆分"
            placement="top"
          >
            <el-icon>
              <WarnTriangleFilled :size="20" color="#ffb940" />
            </el-icon>
          </el-tooltip>
          <el-icon>
            <Cpu />
          </el-icon>
          <span> 模型分解 </span>
        </el-space>
        <div class="grid-silder" :class="decomposeDisable">
          <el-slider
            show-input
            v-model="config.decompose"
            @change="onChangeDecompose"
            :step="0.01"
            :min="0"
            :max="20"
          />
        </div>
      </div>
      <div class="option">
        <el-space>
          <el-icon>
            <Rank :size="20" />
          </el-icon>
          <span> 模型材质拖拽 </span>
        </el-space>
        <div class="grid-silder" :class="moveDisable">
          <el-switch v-model="config.move" @change="onChangeMove" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed, getCurrentInstance, onMounted } from "vue";
import { useStore } from "vuex";
const store = useStore();
const { $bus } = getCurrentInstance().proxy;
const state = reactive({
  modelApi: computed(() => {
    return store.state.modelApi;
  }),
});
const optionsDisable = computed(() => {
  const { glow } = config;
  return glow ? "" : "disabled";
});

const decomposeDisable = computed(() => {
  const modelMaterialList = state.modelApi.modelMaterialList;
  const decomposeMesh = modelMaterialList.filter((v) => v.type == "Mesh");
  return decomposeMesh.length <= 1 || config.move ? "disabled" : "";
});
const moveDisable = computed(() => {
  const modelMaterialList = state.modelApi.modelMaterialList;
  const decomposeMesh = modelMaterialList.filter((v) => v.type == "Mesh");
  return decomposeMesh.length <= 1 ? "disabled" : "";
});

const config = reactive({
  glow: false,
  threshold: 0.05,
  strength: 0.6,
  radius: 1,
  decompose: 0,
  move: false,
  toneMappingExposure: 2,
});
onMounted(() => {
  $bus.on("model-update", () => {
    Object.assign(config, {
      decompose: 0,
      toneMappingExposure: 2,
    });
  });
});
const onChangeFlow = () => {
  state.modelApi.onSetUnrealBloomPass(config);
};
const onChangeDecompose = () => {
  state.modelApi.setModelMeshDecompose(config);
};
const onChangeMove = () => {
  config.decompose = 0;
  state.modelApi.setModelMeshDecompose(config);
};
defineExpose({
  config,
});
</script>
<style lang="scss" scoped></style>
