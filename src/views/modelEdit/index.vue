<template>
  <div class="w-full bg-[#0a0b0e] overflow-hidden h-screen">
    <!-- 头部操作栏 -->
    <header class="box-border flex items-center justify-between w-full h-[50px] px-[20px] font-medium text-white bg-[#06070a]/85 border-b border-[#20222e] shadow-[0_4px_20px_0_rgba(0,0,0,0.3)] backdrop-blur-md z-50 relative">
      <div class="flex items-center space-x-3 text-[14px]">
        <div class="flex items-center space-x-2">
          <div class="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] animate-pulse"></div>
          <span class="font-extrabold tracking-wider bg-gradient-to-r from-[#ffffff] to-[#a5b4fc] bg-clip-text text-transparent text-[15px]">
            ThreeD Studio
          </span>
          <span class="text-xs text-[#9ca3af] font-normal hidden lg:inline">| 3D模型可视化编辑系统</span>
        </div>
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#1e2030]/60 text-[#a855f7] border border-[#312e81]/40">
          作者: answer
        </span>
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#1e2030]/60 text-[#00f2fe] border border-[#0e7490]/40">
          Three.js v{{ THREE.REVISION }}
        </span>
      </div>
      <div>
        <el-space :size="10">
          <el-button class="header-btn" type="primary" icon="Film" @click="$router.push({ path: '/modelBase' })"> 模型库 </el-button>
          <el-button class="header-btn" type="primary" icon="Document" v-if="handleConfigBtn" @click="onSaveConfig">保存数据</el-button>
          <el-button class="header-btn" type="primary" icon="View" v-if="handleConfigBtn" @click="onPreview">效果预览</el-button>
          <el-dropdown trigger="click">
            <el-button class="header-btn" type="primary" icon="Download"> 下载/导出<el-icon class="el-icon--right"></el-icon> </el-button>
            <template #dropdown>
              <el-dropdown-menu class="premium-dropdown">
                <el-dropdown-item @click="onDownloadCover">下载封面</el-dropdown-item>
                <el-dropdown-item @click="onExportModelFile('glb')">导出模型(.glb)格式</el-dropdown-item>
                <el-dropdown-item @click="onExportModelFile('gltf')">导出模型(.gltf)格式</el-dropdown-item>
                <el-dropdown-item @click="onExportModelFile('usdz')">导出模型(.usdz)格式</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button class="header-btn" type="primary" icon="HelpFilled" v-if="handleConfigBtn" @click="onImportantCode"> 嵌入代码 </el-button>
          <el-button class="header-btn" type="primary" icon="FullScreen" @click="onFullScreen">
            {{ fullscreenStatus ? "取消全屏" : "全屏" }}
          </el-button>
        </el-space>
      </div>
    </header>
    <div class="flex">
      <!-- 模型列表 -->
      <model-choose ref="choosePanel"></model-choose>
      <!-- 模型视图 -->
      <div id="model" @drop="onDragDrop" ref="model" @dragover.prevent class="relative w-[calc(100%-685px)] h-[calc(100vh-50px)] bg-[#0d0e12]">
        <!-- 悬浮重置相机视角按钮 -->
        <div class="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <el-tooltip effect="dark" content="重置相机视角" placement="bottom">
            <button @click="onResetCamera" class="flex items-center justify-center w-10 h-10 rounded-full bg-[#111218]/80 backdrop-blur-md border border-[#2c2f42] text-[#9ca3af] hover:text-white hover:border-[#6366f1] hover:shadow-[0_0_15px_rgba(99,102,241,0.35)] transition-all duration-300">
              <el-icon :size="20">
                <Aim />
              </el-icon>
            </button>
          </el-tooltip>
        </div>
        <div id="mesh-txt"></div>
      </div>
      <!-- 右侧编辑栏 -->
      <div class="min-w-[380px] h-[calc(100vh-50px)]">
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

