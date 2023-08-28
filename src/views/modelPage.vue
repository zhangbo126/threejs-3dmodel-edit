<template>
  <div class="model-page">
    <!-- 头部操作栏 -->
    <header class="model-header">
      <div class="header-lf">
        <span> 基于Three.js+Vue3+Element-Plus开发的3d模型可视化编辑系统 </span>
        <span>作者:answer</span>
      </div>
      <div class="header-lr">
        <el-button type="primary" @click="onSaveConfig">保存配置</el-button>
        <el-button type="primary" @click="onPrivew">预览</el-button>
      </div>
    </header>
    <div class="model-container" v-zLoading="loading">
      <!-- 模型列表 -->
      <model-choose ref="choosePanel"></model-choose>
      <!-- 模型视图 -->
      <div id="model" ref="model">
        <div class="camera-icon">
          <el-tooltip effect="dark" content="居中" placement="top">
            <el-icon :size="18" color="#fff" @click="onResetCamera">
              <Aim />
            </el-icon>
          </el-tooltip>
        </div>
        <div id="mesh-txt"></div>
      </div>
      <!-- 右侧编辑栏 -->
      <div class="edit-panel" :style="{ minWidth: '380px' }">
        <model-edit-panel ref="editPanel" v-if="state.modelApi.model"></model-edit-panel>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ModelEditPanel, ModelChoose } from "@/components/index";
import { onMounted, ref, reactive, computed, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import renderModel from "./renderModel";
import { local } from "@/utils/storage";
import { MODEL_PRIVEW_CONFIG } from "@/config/constant";
const store = useStore();
const router = useRouter();
const { $bus } = getCurrentInstance().proxy;
const state = reactive({
  modelApi: computed(() => {
    return store.state.modelApi;
  }),
});
const loading = ref(false);
const editPanel = ref(null);
const choosePanel = ref(null);
// 重置相机位置
const onResetCamera = () => {
  state.modelApi.onResetModelCamera();
};
// 预览
const onPrivew = () => {
  const modelConfig = editPanel.value.getPanelConfig();
  modelConfig.fileInfo = choosePanel.value.activeModel;
  local.set(MODEL_PRIVEW_CONFIG, modelConfig);
  const { href } = router.resolve({ path: "/preview" });
  window.open(href, "_blank");
};
// 保存配置
const onSaveConfig = () => {
  const modelConfig = editPanel.value.getPanelConfig();
  console.log(modelConfig)
  ElMessage.success("配置获取成功请在控制台中查看");
};
onMounted(async () => {
  loading.value = true;
  const modelApi = new renderModel("#model");
  store.commit("SET_MODEL_API", modelApi);
  $bus.on("page-loading", (value) => {
    loading.value = value;
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
  background-color: #1b1c23;
  .model-header {
    height: 35px;
    width: 100%;
    background-color: #010c1d;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
    text-align: center;
    font-weight: 500;
    color: #fff;
    text-shadow: 5px 3px 5px #c11212;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 20px;
    box-sizing: border-box;
  }

  .model-container {
    display: flex;

    #model {
      width: calc(100% - 630px);
      height: calc(100vh - 35px);
      position: relative;
      .camera-icon {
        position: absolute;
        top: 10px;
        left: calc(100% - 50%);
        cursor: pointer;
      }
      #mesh-txt {
        position: absolute;
        display: none;
        color: white;
        background-color: #67c23a;
        opacity: 0.8;
        font-size: 14px;
        font-weight: 600;
        pointer-events: none;
        padding: 10px;
        border-radius: 10px;
        cursor: all-scroll;
        -webkit-user-select: none; /* Safari 3.1+ */
        -moz-user-select: none; /* Firefox 2+ */
        -ms-user-select: none; /* IE 10+ */
        user-select: none; /* Standard syntax */
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
