<template>
  <div class="model-page">
    <!-- 头部操作栏 -->
    <header class="model-header">
      <div class="lf">基于three.js的3d模型可视化编辑系统</div>
      <div class="title">当前模型:{{ modelName }}</div>
      <div class="lr">
        <el-space>
          <div class="label">
            <el-button type="primary" @click="onChangeModel">选择模型</el-button>
          </div>
          <div class="label">
            <el-button type="primary">导出模型</el-button>
          </div>
        </el-space>
      </div>
    </header>
    <div class="model-container" v-Loading="loading">
      <!-- 模型列表 -->
      <model-choose></model-choose>
      <!-- 模型视图 -->
      <div id="model">
        <div class="camera-icon">
          <el-tooltip effect="dark" content="居中" placement="top">
            <el-icon :size="18" color="#fff" @click="onResetCamera">
              <Aim />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
      <!-- 右侧编辑栏 -->
      <div class="edit-panel" :style="{ minWidth: '380px' }">
        <model-edit-panel v-if="!loading"></model-edit-panel>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ModelEditPanel,  ModelChoose } from "@/components/index";
import { onMounted, ref, reactive, computed, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import renderModel from "./renderModel";
const store = useStore();
const { $bus } = getCurrentInstance().proxy;

const state = reactive({
  modelApi: computed(() => {
    return store.state.modelApi;
  }),
});
const select = ref(null);
const loading = ref(false);
const modelName = ref("默认模型");
const onChangeModel = () => {
  select.value.showDialog();
};
// 重置相机位置
const onResetCamera = () => {
  state.modelApi.onResetModelCamera();
};

onMounted(async () => {
  loading.value = true;
  const modelApi = new renderModel("#model");
  store.commit("SET_MODEL_API", modelApi);
  $bus.on("page-loading", (value) => {
    loading.value = value;
    console.log(loading.value, value);
  });
  const load = await modelApi.init();
  if (load) {
    loading.value = false;
  }
});
</script>

<style lang="less" scoped>
.model-page {
  width: 100%;
  .model-header {
    height: 45px;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0px 10px;
    .lr {
      display: flex;
    }
  }

  .model-container {
    display: flex;

    #model {
      width: calc(100% - 630px);
      height: calc(100vh - 45px);
      position: relative;
      .camera-icon {
        position: absolute;
        top: 10px;
        left: calc(100% - 50%);
        cursor: pointer;
      }
    }
  }
}
</style>

<style lang="scss">
.edit-box,
.model-choose {
  .header {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #33343f;
    color: #ccc;
    padding: 0px 20px;
    border-bottom: 1px solid #1b1c23;
    border-top: 1px solid #1b1c23;
    box-sizing: border-box;
  }
  .disabled {
    opacity: 0.3;
    pointer-events: none;
  }
  .options {
    max-width: 380px;
    box-sizing: border-box;
    background-color: #1b1c23;
    .option-active {
      background-color: #27282f;
    }
    .space-between {
      justify-content: space-between;
    }
    .option {
      padding: 0px 18px;
      box-sizing: border-box;
      cursor: pointer;
      color: #ccc;
      display: flex;
      align-items: center;
      height: 40px;
      font-size: 14px;
      .icon-name {
        display: flex;
        align-items: center;
      }
    }
  }
}

.el-input-number {
  width: 90px !important;
}
</style>
