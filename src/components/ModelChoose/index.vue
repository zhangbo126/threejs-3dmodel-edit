<template>
  <div class="min-w-[305px] h-[calc(100vh-50px)] bg-[#111218] border-r border-[#20222e] flex flex-col select-none">
    <!-- 固定场景编辑模式头部 -->
    <div class="box-border flex items-center justify-between w-full h-[40px] px-[16px] text-[#9ca3af] bg-[#171822] border-b border-[#20222e] shrink-0">
      <span class="text-[11px] font-bold tracking-wider uppercase text-[#a5b4fc]">模式: {{ modelEditMap[reactiveData.modeEditType].text }}</span>
      <el-tooltip effect="dark" :content="modelEditMap[reactiveData.modeEditType].tooltip" placement="top">
        <el-button
          type="primary"
          size="small"
          icon="Switch"
          class="!px-2.5 !py-1 !h-6 !text-[11px]"
          @click="
            switchActiveModelEdit(modelEditMap[reactiveData.modeEditType] && modelEditMap[reactiveData.modeEditType].switchType)
          "
        >
          切换场景
        </el-button>
      </el-tooltip>
    </div>

    <!-- 可滚动内容区 -->
    <el-scrollbar class="flex-1">
      <!-- 普通模型 -->
      <div class="box-border w-full bg-[#111218] py-2 border-b border-[#20222e]/50">
        <div class="box-border flex items-center h-[30px] px-[16px] text-[11px] font-bold text-[#9ca3af] tracking-wider uppercase">
          <el-space :size="6">
            <el-icon class="text-[#6366f1]"><Orange /></el-icon>
            <span>普通模型</span>
          </el-space>
        </div>
        <!-- 模型列表 -->
        <div class="px-2 max-h-[210px] overflow-y-auto">
          <el-row :gutter="8">
            <el-col
              :draggable="(modelEditMap[reactiveData.modeEditType] && modelEditMap[reactiveData.modeEditType].draggable) || false"
              :style="modelTypeStyle"
              :span="12"
              v-for="model in ordinaryModelList"
              @dragstart="e => onDragModelStart(model)"
              @drag="e => onDrag(e)"
              :key="model.id"
              class="p-1"
            >
              <el-image
                draggable="false"
                @click.prevent="onChangeModel(model)"
                class="box-border w-full h-[76px] model-card"
                :class="reactiveData.activeModelId == model.id ? 'active-model' : ''"
                :src="model.icon"
                fit="cover"
              />
            </el-col>
          </el-row>
        </div>
      </div>

      <!-- 动画模型 -->
      <div class="box-border w-full bg-[#111218] py-2 border-b border-[#20222e]/50">
        <div class="box-border flex items-center h-[30px] px-[16px] text-[11px] font-bold text-[#9ca3af] tracking-wider uppercase">
          <el-space :size="6">
            <el-icon class="text-[#a855f7]"><Paperclip /></el-icon>
            <span>动画模型</span>
          </el-space>
        </div>
        <!-- 模型列表 -->
        <div class="px-2 max-h-[210px] overflow-y-auto">
          <el-row :gutter="8">
            <el-col
              :draggable="modelEditMap[reactiveData.modeEditType].draggable"
              :style="modelTypeStyle"
              :span="12"
              v-for="model in animationModelList"
              @dragstart="e => onDragModelStart(model)"
              @drag="e => onDrag(e)"
              :key="model.id"
              class="p-1"
            >
              <el-image
                draggable="false"
                @click="onChangeModel(model)"
                class="box-border w-full h-[76px] model-card"
                :class="reactiveData.activeModelId == model.id ? 'active-model' : ''"
                :src="model.icon"
                fit="cover"
              />
            </el-col>
          </el-row>
        </div>
      </div>

      <!-- 几何体模型 -->
      <div class="box-border w-full bg-[#111218] py-2 border-b border-[#20222e]/50">
        <div class="box-border flex items-center h-[30px] px-[16px] text-[11px] font-bold text-[#9ca3af] tracking-wider uppercase justify-between">
          <el-space :size="6">
            <el-icon class="text-[#00f2fe]"><SwitchFilled /></el-icon>
            <span>几何体模型</span>
          </el-space>
          <span class="text-[10px] text-[#10b981] font-medium normal-case" v-if="reactiveData.geometryVisible">(可拖拽添加)</span>
        </div>
        <!-- 模型列表 -->
        <div class="px-3">
          <el-row :gutter="8" v-if="reactiveData.geometryVisible" class="py-1">
            <el-col :span="8" v-for="model in geometryModelList" :key="model.type" class="p-1">
              <div
                class="flex flex-col items-center justify-center h-[54px] text-[11px] text-[#d1d5db] text-center cursor-all-scroll geometry-card"
                :class="reactiveData.activeModelId == model.id ? 'active-model' : ''"
                draggable="true"
                @dragstart="e => onDragstart(e, model)"
                @drag="e => onDrag(e)"
              >
                <el-tooltip effect="dark" :content="`${model.name}:${model.type}`" placement="top">
                  <span class="font-semibold px-1 truncate w-full">{{ model.name }}</span>
                </el-tooltip>
              </div>
            </el-col>
          </el-row>
          <div class="relative box-border flex justify-center py-2" v-else>
            <div class="flex flex-col items-center justify-center w-full h-[76px] upload-box cursor-pointer" @click="onAddGeometry">
              <el-icon :size="20" class="mb-1 text-[#9ca3af]"><Plus /></el-icon>
              <span class="text-[11px] font-medium">添加几何体模型</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 外部模型 -->
      <div class="box-border w-full bg-[#111218] py-2">
        <div class="box-border flex items-center h-[30px] px-[16px] text-[11px] font-bold text-[#9ca3af] tracking-wider uppercase">
          <el-space :size="6">
            <el-icon class="text-[#3b82f6]"><UploadFilled /></el-icon>
            <span>外部模型</span>
          </el-space>
        </div>
        <!-- 模型内容 -->
        <div class="px-[16px] pb-2 text-[11px] text-[#9ca3af] flex items-center space-x-1.5" v-if="reactiveData.localModelName">
          <span class="shrink-0">当前模型:</span>
          <el-tooltip effect="dark" :content="reactiveData.localModelName" placement="top">
            <b class="text-white font-semibold truncate max-w-[180px]">{{ reactiveData.localModelName }}</b>
          </el-tooltip>
        </div>
        <el-upload
          action=""
          accept=".glb,.obj,.gltf,.fbx,.stl"
          class="relative box-border flex justify-center px-[16px] pb-2 text-[#8c939d] text-center cursor-pointer"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onUpload"
        >
          <div class="flex flex-col items-center justify-center w-[273px] h-[80px] upload-box">
            <el-icon :size="20" class="mb-1 text-[#9ca3af]"><Plus /></el-icon>
            <span class="text-[11px] font-medium px-2 leading-tight">选择本地 3D 模型文件</span>
            <span class="text-[9px] text-[#6b7280] mt-0.5">支持 .glb, .obj, .gltf, .fbx, .stl</span>
          </div>
        </el-upload>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance, reactive } from "vue";
import { modelList, geometryModelList } from "@/config/model.js";
import { useMeshEditStore } from "@/store/meshEditStore";
import { getFileType, getAssetsFile } from "@/utils/utilityFunction.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { UPDATE_MODEL, PAGE_LOADING, MODEL_TYPE_ENUM } from "@/config/constant";

const modelEditMap = {
  oneModel: {
    text: "单模型",
    tooltip: "当前为单模型编辑模式，通过点击加载不同模型",
    draggable: false,
    switchType: "many"
  },
  many: {
    text: "多模型",
    tooltip: "当前为多模型编辑模式：通过拖拽添加多个模型",
    draggable: true,
    switchType: "oneModel"
  },
  geometry: {
    text: "几何体",
    tooltip: "当前为几何体模型编辑模式：通过拖拽添加多个几何体模型",
    draggable: false,
    switchType: "oneModel"
  }
};
const store = useMeshEditStore();
const { $bus } = getCurrentInstance().proxy;

//普通模型
const ordinaryModelList = computed(() => {
  return modelList.filter(v => !v.animation);
});
// 动画模型
const animationModelList = computed(() => {
  return modelList.filter(v => v.animation);
});

// 不同编辑模式鼠标style
const modelTypeStyle = computed(() => {
  return reactiveData.modeEditType == "many"
    ? { textAlign: "center", cursor: "all-scroll" }
    : { textAlign: "center", cursor: "pointer" };
});

const reactiveData = reactive({
  // 当前模型ID
  activeModelId: 7,
  geometryVisible: false,
  // 当前模型编辑模式:oneModel 单模型 many 多模型 geometry 几何体模型
  modeEditType: "oneModel",
  localModelName: null
});

// 当前模型信息
const activeModel = ref({
  name: "su7",
  fileType: "glb",
  id: 7,
  animation: false,
  filePath: "threeFile/glb/glb-7.glb",
  icon: getAssetsFile("model-icon/4.png"),
  decomposeName: "transformers_3",
  key: "transformers-3"
});

// 切换当前模型编辑模式
const switchActiveModelEdit = async switchType => {
  if (switchType == "many") {
    ElMessageBox.confirm("通过拖拽添加多个模型", "切换为多模型编辑模式?", {
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    }).then(() => {
      Object.assign(reactiveData, {
        modeEditType: switchType,
        localModelName: null,
        geometryVisible: false
      });
      store.setActiveEditModelType(MODEL_TYPE_ENUM.ManyModel);
      store.modelApi.clearSceneModel();
      ElMessage.success("切换成功：当前为多模型编辑模式");
    });
  } else if (["geometry", "oneModel"].includes(switchType)) {
    // 加载单模型
    $bus.emit(PAGE_LOADING, true);
    try {
      const { load } = await store.modelApi.onSwitchModel(activeModel.value);
      if (load) {
        Object.assign(reactiveData, {
          modeEditType: "oneModel",
          activeModelId: activeModel.value.id,
          localModelName: null,
          geometryVisible: false
        });
        $bus.emit(UPDATE_MODEL);
        $bus.emit(PAGE_LOADING, false);
        store.setActiveEditModelType(MODEL_TYPE_ENUM.OneModel);
        ElMessage.success("切换成功：当前为单模型编辑模式");
      }
    } catch (err) {
      $bus.emit(PAGE_LOADING, false);
    }
  }
};
//选择模型
const onChangeModel = async model => {
  if (model.id == reactiveData.activeModelId || reactiveData.modeEditType == "many") return false;
  activeModel.value = model;
  store.setActiveEditModelType(MODEL_TYPE_ENUM.OneModel);
  Object.assign(reactiveData, {
    activeModelId: model.id,
    localModelName: null,
    modeEditType: "oneModel",
    geometryVisible: false
  });

  $bus.emit(PAGE_LOADING, true);
  try {
    const { load } = await store.modelApi.onSwitchModel(model);
    if (load) {
      $bus.emit(UPDATE_MODEL);
      $bus.emit(PAGE_LOADING, false);
    }
  } catch (err) {
    $bus.emit(PAGE_LOADING, false);
  }
};

// 添加几何模型
const onAddGeometry = async () => {
  Object.assign(reactiveData, {
    activeModelId: null,
    localModelName: null,
    modeEditType: "geometry",
    geometryVisible: true
  });
  store.modelApi.clearSceneModel();
};

// 拖拽几何模型开始
const onDragstart = (e, model) => {
  store.modelApi.setDragGeometryModel(model);
  store.setActiveEditModelType(MODEL_TYPE_ENUM.Geometry);
};
// 拖拽中
const onDrag = event => {
  event.preventDefault();
};

// 拖拽模型开始
const onDragModelStart = model => {
  store.setActiveEditModelType(MODEL_TYPE_ENUM.ManyModel);
  store.modelApi.setDragManyModel(model);
};

// 选择本地模型文件
const onUpload = async file => {
  reactiveData.localModelName = file.name;
  const filePath = URL.createObjectURL(file.raw);

  const model = {
    filePath,
    fileType: getFileType(file.name)
  };
  $bus.emit(PAGE_LOADING, true);
  try {
    const { load, filePath } = await store.modelApi.onSwitchModel(model);
    // 加载成功之后手动释放 否则会造成内存浪费
    URL.revokeObjectURL(filePath);
    if (load) {
      $bus.emit(UPDATE_MODEL);
      $bus.emit(PAGE_LOADING, false);

      // activeModel.value = {};
      Object.assign(reactiveData, {
        activeModelId: null,
        geometryVisible: false
      });
    }
  } catch (err) {
    reactiveData.localModelName = null;
    $bus.emit(PAGE_LOADING, false);
  }
};

defineExpose({
  activeModel
});
</script>

