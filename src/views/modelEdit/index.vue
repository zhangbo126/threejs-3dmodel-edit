<template>
  <div class="model-page">
    <!-- 头部操作栏 -->
    <header class="model-header">
      <div class="header-lf">
        <span> 基于Three.js+Vue3+Element-Plus开发的3d模型可视化编辑系统 </span>
        <span>作者:answer </span>
        <span>当前Three.js版本:{{ THREE.REVISION }}</span>
      </div>
      <div class="header-lr">
        <el-space>
          <el-button type="primary" icon="Film" @click="$router.push({ path: '/modelBase' })"> 模型库 </el-button>
          <el-button type="primary" icon="Document" v-if="handleConfigBtn" @click="onSaveConfig">保存数据</el-button>
          <el-button type="primary" icon="View" v-if="handleConfigBtn" @click="onPreview">效果预览</el-button>
          <el-dropdown trigger="click">
            <el-button type="primary" icon="Download"> 下载/导出<el-icon class="el-icon--right"></el-icon> </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="onDownloadCover">下载封面</el-dropdown-item>
                <el-dropdown-item @click="onExportModelFile('glb')">导出模型(.glb)格式</el-dropdown-item>
                <el-dropdown-item @click="onExportModelFile('gltf')">导出模型(.gltf)格式</el-dropdown-item>
                <el-dropdown-item @click="onExportModelFile('usdz')">导出模型(.usdz)格式</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button type="primary" icon="HelpFilled" v-if="handleConfigBtn" @click="onImportantCode"> 嵌入代码 </el-button>
          <el-button type="primary" icon="FullScreen" @click="onFullScreen">
            {{ fullscreenStatus ? "取消全屏" : "全屏" }}
          </el-button>
        </el-space>
      </div>
    </header>
    <div class="model-container">
      <!-- 模型列表 -->
      <model-choose ref="choosePanel"></model-choose>
      <!-- 模型视图 -->
      <div id="model" @drop="onDragDrop" ref="model" @dragover.prevent>
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
        <model-edit-panel ref="editPanel" v-if="store.modelApi.model"></model-edit-panel>
      </div>
    </div>
    <!-- 视频背景video -->
    <video id="video" loop="loop" playsinline autoplay style="display: none"></video>
    <page-loading :loading="loading" :percentage="progress"></page-loading>
    <!-- 嵌入代码弹框 -->
    <implant-code-dialog ref="implantDialog"></implant-code-dialog>
  </div>
</template>

<script setup name="modelEdit">
import { ModelEditPanel, ModelChoose, ImplantCodeDialog } from "@/components/index";
import { onMounted, ref, getCurrentInstance, onBeforeUnmount, computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import renderModel from "@/utils/renderModel";
import { modelList } from "@/config/model";
import PageLoading from "@/components/Loading/PageLoading.vue";
import { MODEL_PREVIEW_CONFIG, MODEL_BASE_DATA, MODEL_DEFAULT_CONFIG, UPDATE_MODEL, PAGE_LOADING } from "@/config/constant";
import { useMeshEditStore } from "@/store/meshEditStore";
import * as THREE from "three";

const store = useMeshEditStore();
const router = useRouter();
const { $bus, $local } = getCurrentInstance().proxy;

const loading = ref(false);
const progress = ref(0);
const editPanel = ref(null);
const choosePanel = ref(null);
const implantDialog = ref(null);
const fullscreenStatus = ref(false);
const loadingTimeout = ref(null);

const handleConfigBtn = computed(() => {
  if (editPanel.value) {
    const fileInfo = choosePanel.value?.activeModel;
    return fileInfo?.filePath && ["oneModel", "tags"].includes(store.modelType) ? true : false;
  }
  return false;
});

// // 页面资源刷新
// const updateResources = () => {
//   const env = import.meta.env.VITE_USER_NODE_ENV;
//   if (env == "production") {
//     ElMessageBox.confirm(
//       "本网站采用“腾讯云静态网站托管”每次更新资源可能存在缓存问题,若页面内容显示异常使用“ctrl+f5”强刷页面即可",
//       "提示",
//       {
//         showClose: false,
//         closeOnClickModal: false,
//         closeOnPressEscape: false,
//         distinguishCancelAndClose: true,
//         confirmButtonText: "关闭弹框",
//         showCancelButton: false
//       }
//     )
//       .then(() => {})
//       .catch(() => {
//         location.reload(true);
//       });
//   }
// };

// 重置相机位置
const onResetCamera = () => {
  store.modelApi.onResetModelCamera();
};
// 初始化模型库数据
const initModelBaseData = () => {
  const modelBase = $local.get(MODEL_BASE_DATA);
  // 如果是首次加载需要设置模型库初始数据值
  if (!Array.isArray(modelBase)) {
    let modelBaseData = [];
    modelList.forEach(v => {
      modelBaseData.push({
        ...MODEL_DEFAULT_CONFIG,
        fileInfo: { ...v }
      });
    });

    $local.set(MODEL_BASE_DATA, modelBaseData);
  }
};

// 处理拖拽结束事件
const onDragDrop = async e => {
  const { dragGeometryModel, dragTag, activeDragManyModel } = store.modelApi;
  const { clientX, clientY } = e;

  // 更新拖拽位置
  const updateDragPosition = model => {
    model.clientX = clientX;
    model.clientY = clientY;
  };

  // 处理几何体模型
  if (dragGeometryModel.id && store.modelType === "geometry") {
    updateDragPosition(dragGeometryModel);
    store.modelApi.onSwitchModel(dragGeometryModel);
    $bus.emit("update-tab", "EditGeometry");
  }

  // 处理3D标签
  if (dragTag.id && store.modelType === "tags") {
    updateDragPosition(dragTag);
    store.modelApi.create3dTags(dragTag);
  }

  // 处理多模型
  if (store.modelType === "manyModel") {
    updateDragPosition(activeDragManyModel);

    try {
      $bus.emit(PAGE_LOADING, true);
      const { load } = await store.modelApi.onLoadManyModel(activeDragManyModel);

      if (load) {
        $bus.emit(UPDATE_MODEL);
        $bus.emit("update-tab", "EditMoreModel");
      }
    } catch (error) {
      console.error("加载多模型失败:", error);
    } finally {
      $bus.emit(PAGE_LOADING, false);
    }
  }
};
// 预览
const onPreview = () => {
  const modelConfig = editPanel.value.getPanelConfig();
  modelConfig.camera = store.modelApi.onGetModelCamera();
  modelConfig.fileInfo = choosePanel.value?.activeModel;
  //判断是否是外部模型
  if (modelConfig.fileInfo.filePath) {
    $local.set(MODEL_PREVIEW_CONFIG, modelConfig);
    const { href } = router.resolve({ path: "/preview" });
    window.open(href, "_blank");
  } else {
    ElMessage.warning("当前模型暂不支持“效果预览”");
  }
};

const onImportantCode = () => {
  const modelConfig = editPanel.value.getPanelConfig();
  modelConfig.camera = store.modelApi.onGetModelCamera();
  modelConfig.fileInfo = choosePanel.value?.activeModel;
  implantDialog.value.showDialog(modelConfig);
};

// 全屏
const onFullScreen = () => {
  const element = document.documentElement;
  if (!fullscreenStatus.value) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
      // 适用于旧版WebKit浏览器
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
};

// 保存配置
const onSaveConfig = () => {
  ElMessageBox.confirm(" 确认要更新当前模型数据至“模板库”?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "success"
  })
    .then(() => {
      const modelConfig = editPanel.value.getPanelConfig();
      modelConfig.camera = store.modelApi.onGetModelCamera();
      modelConfig.fileInfo = choosePanel.value?.activeModel;
      // 判断是否是外部模型
      if (modelConfig.fileInfo.filePath) {
        const modelBaseData = $local.get(MODEL_BASE_DATA) || [];
        const { id } = modelConfig.fileInfo;
        // 更新缓存数据
        Object.assign(modelBaseData.filter(v => id === v.fileInfo.id)[0], modelConfig);
        $local.set(MODEL_BASE_DATA, modelBaseData);
        ElMessage.success("更新成功");
      } else {
        ElMessage.warning("当前模型暂不支持“数据保存”");
      }
    })
    .catch(() => {});
};

// 下载封面
const onDownloadCover = () => {
  store.modelApi.onDownloadSceneCover();
};
// 导出模型
const onExportModelFile = type => {
  store.modelApi.onExporterModel(type);
};

// 全屏监听事件
const addEventListenerFullscreen = e => {
  const status = document.fullscreenElement || document.webkitFullscreenElement;
  fullscreenStatus.value = !!status;
};

onMounted(async () => {
  loading.value = true;
  const modelApi = new renderModel("#model");
  store.setModelApi(modelApi);
  $bus.on(PAGE_LOADING, value => {
    clearTimeout(loadingTimeout.value);
    if (value) {
      loading.value = value;
    } else {
      loadingTimeout.value = setTimeout(() => {
        loading.value = value;
        progress.value = 0;
      }, 500);
    }
  });
  // 模型加载进度条
  store.modelApi.onProgress((progressNum, totalSize) => {
    progress.value = Number(((progressNum / totalSize) * 100).toFixed(0));
  });

  const load = await modelApi.init();

  if (load) {
    loading.value = false;
    progress.value = 0;
  }
  // 初始化模型库数据
  initModelBaseData();
  // 全屏监听事件
  document.addEventListener("fullscreenchange", addEventListenerFullscreen);
});
onBeforeUnmount(() => {
  store.modelApi.onClearModelData();
  document.removeEventListener("fullscreenchange", addEventListenerFullscreen);
  clearTimeout(loadingTimeout.value);
});
</script>

<style lang="scss" scoped>
.model-page {
  width: 100%;
  background-color: #1b1c23;
  .model-header {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 35px;
    padding: 0 10px;
    font-weight: 500;
    color: #ffffff;
    text-align: center;
    text-shadow: 5px 3px 5px #c11212;
    background-color: #010c1d;
    box-shadow: 0 2px 8px 0 rgb(0 0 0 / 10%);
    .header-lf {
      font-size: 14px;
    }
  }
  .model-container {
    display: flex;
    #model {
      position: relative;
      width: calc(100% - 630px);
      height: calc(100vh - 35px);
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
.edit-box {
  height: calc(100vh - 90px);
}
.edit-box,
.model-choose {
  .header {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 35px;
    padding: 0 20px;
    color: #cccccc;
    background-color: #33343f;
    border-top: 1px solid #1b1c23;
    border-bottom: 1px solid #1b1c23;
  }
  .disabled {
    pointer-events: none;
    opacity: 0.3;
  }
  .options {
    box-sizing: border-box;
    max-width: 380px;
    background-color: #1b1c23;
    .option-active {
      background-color: #27282f;
    }
    .space-between {
      justify-content: space-between;
    }
    .option {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      height: 33px;
      padding: 0 18px;
      font-size: 14px;
      color: #cccccc;
      cursor: pointer;
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
