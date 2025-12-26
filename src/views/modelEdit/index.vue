<template>
  <div class="w-full bg-[#1b1c23]">
    <!-- 头部操作栏 -->
    <header class="box-border flex items-center justify-between w-full h-[35px] px-[10px] font-medium text-white text-center  bg-[#010c1d] shadow-[0_2px_8px_0_rgba(0,0,0,0.1)]">
      <div class="text-[14px]">
        <span> 基于Three.js+Vue3+Element-Plus开发的3d模型可视化编辑系统 </span>
        <span>作者:answer </span>
        <span>当前Three.js版本:{{ THREE.REVISION }}</span>
      </div>
      <div>
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
    <div class="flex">
      <!-- 模型列表 -->
      <model-choose ref="choosePanel"></model-choose>
      <!-- 模型视图 -->
      <div id="model" @drop="onDragDrop" ref="model" @dragover.prevent class="relative w-[calc(100%-630px)] h-[calc(100vh-35px)]">
        <div class="absolute top-[10px] left-[calc(100%-50%)] cursor-pointer">
          <el-tooltip effect="dark" content="居中" placement="top">
            <el-icon :size="18" color="#fff" @click="onResetCamera">
              <Aim />
            </el-icon>
          </el-tooltip>
        </div>
        <div id="mesh-txt"></div>
      </div>
      <!-- 右侧编辑栏 -->
      <div class="min-w-[380px]">
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
import { MODEL_PREVIEW_CONFIG, MODEL_BASE_DATA, MODEL_DEFAULT_CONFIG, UPDATE_MODEL, PAGE_LOADING, MODEL_TYPE_ENUM } from "@/config/constant";
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
    return fileInfo?.filePath && [MODEL_TYPE_ENUM.OneModel, MODEL_TYPE_ENUM.Tags].includes(store.modelType) ? true : false;
  }
  return false;
});

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
  const { dragGeometryModel, activeDragManyModel, dragTag } = store.modelApi;
  const { clientX, clientY } = e;

  // 更新拖拽位置
  const updateDragPosition = model => {
    model.clientX = clientX;
    model.clientY = clientY;
  };

  // 处理几何体模型
  if (dragGeometryModel.id && store.modelType === MODEL_TYPE_ENUM.Geometry) {
    updateDragPosition(dragGeometryModel);
    store.modelApi.onSwitchModel(dragGeometryModel);
    $bus.emit("update-tab", "EditGeometry");
  }

  // 处理3D标签
  if (dragTag?.id && store.modelType === MODEL_TYPE_ENUM.Tags) {
    updateDragPosition(dragTag);
    store.modelApi.create3dTags(dragTag);
  }

  // 处理多模型
  if (store.modelType === MODEL_TYPE_ENUM.ManyModel) {
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

  // 处理着色器
  if (store.modelType === MODEL_TYPE_ENUM.Shader) {
    store.modelApi.shaderModules.createShader({ clientX, clientY });
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

