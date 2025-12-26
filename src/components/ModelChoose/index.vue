<template>
  <div class="min-w-[305px] h-[calc(100vh-35px)] bg-[#1b1c23]">
    <el-scrollbar max-height="calc(100vh - 72px)">
      <div class="box-border flex items-center justify-between w-full h-[35px] px-[20px] text-[#cccccc] bg-[#33343f] border-t border-b border-[#1b1c23]">
        <span>当前场景编辑模式:{{ modelEditMap[reactiveData.modeEditType].text }}</span>
        <el-tooltip effect="dark" :content="modelEditMap[reactiveData.modeEditType].tooltip" placement="top">
          <el-button
            type="primary"
            icon="Switch"
            @click="
              switchActiveModelEdit(modelEditMap[reactiveData.modeEditType] && modelEditMap[reactiveData.modeEditType].switchType)
            "
          >
            切换场景
          </el-button>
        </el-tooltip>
      </div>
      <!-- 普通模型 -->
      <div class="box-border max-w-[380px] bg-[#1b1c23]">
        <div class="box-border flex items-center h-[33px] px-[18px] text-[14px] text-[#cccccc] cursor-pointer">
          <el-space>
            <el-icon>
              <Orange />
            </el-icon>
            <span>普通模型</span>
          </el-space>
        </div>
        <!-- 模型列表 -->
        <el-scrollbar max-height="210px">
          <el-row>
            <el-col
              :draggable="(modelEditMap[reactiveData.modeEditType] && modelEditMap[reactiveData.modeEditType].draggable) || false"
              :style="modelTypeStyle"
              :span="12"
              v-for="model in ordinaryModelList"
              @dragstart="e => onDragModelStart(model)"
              @drag="e => onDrag(e)"
              :key="model.id"
            >
              <el-image
                draggable="false"
                @click.prevent="onChangeModel(model)"
                class="box-border w-[145px] h-[88px] mb-[4px] opacity-50"
                :class="reactiveData.activeModelId == model.id ? 'border-[3px] border-[#18c174] opacity-100' : ''"
                :src="model.icon"
                fit="cover"
              />
            </el-col>
          </el-row>
        </el-scrollbar>
      </div>
      <!-- 动画模型 -->
      <div class="box-border max-w-[380px] bg-[#1b1c23]">
        <div class="box-border flex items-center h-[33px] px-[18px] text-[14px] text-[#cccccc] cursor-pointer">
          <el-space>
            <el-icon>
              <Paperclip />
            </el-icon>
            <span>动画模型</span>
          </el-space>
        </div>
        <!-- 模型列表 -->
        <el-scrollbar max-height="210px">
          <el-row>
            <el-col
              :draggable="modelEditMap[reactiveData.modeEditType].draggable"
              :style="modelTypeStyle"
              :span="12"
              v-for="model in animationModelList"
              @dragstart="e => onDragModelStart(model)"
              @drag="e => onDrag(e)"
              :key="model.id"
            >
              <el-image
                draggable="false"
                @click="onChangeModel(model)"
                class="box-border w-[145px] h-[88px] mb-[4px] opacity-50"
                :class="reactiveData.activeModelId == model.id ? 'border-[3px] border-[#18c174] opacity-100' : ''"
                :src="model.icon"
                fit="cover"
              />
            </el-col>
          </el-row>
        </el-scrollbar>
      </div>
      <!-- 几何体模型 -->
      <div class="box-border max-w-[380px] bg-[#1b1c23]">
        <div class="box-border flex items-center h-[33px] px-[18px] text-[14px] text-[#cccccc] cursor-pointer">
          <el-space>
            <el-icon>
              <SwitchFilled />
            </el-icon>
            <span>几何体模型</span>
            <span :style="{ color: '#18c174 ' }" v-if="reactiveData.geometryVisible">(可拖拽添加多个)</span>
          </el-space>
        </div>
        <!-- 模型列表 -->
        <el-scrollbar max-height="120px">
          <el-row v-if="reactiveData.geometryVisible">
            <el-col :style="{ textAlign: 'center' }" :span="8" v-for="model in geometryModelList" :key="model.type">
              <div
                class="flex flex-col items-center justify-center h-[70px] m-[4px_2px] text-[12px] text-white text-center cursor-all-scroll border border-[#dcdfe6]"
                :class="reactiveData.activeModelId == model.id ? 'border-[3px] border-[#18c174] opacity-100' : ''"
                draggable="true"
                @dragstart="e => onDragstart(e, model)"
                @drag="e => onDrag(e)"
              >
                <div>
                  <el-tooltip effect="dark" :content="`${model.name}:${model.type}`" placement="top">
                    <b> {{ model.name }}</b>
                  </el-tooltip>
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="relative box-border flex justify-center px-[20px] overflow-hidden text-[#8c939d] text-center" v-else>
            <div class="flex items-center justify-center w-[228px] h-[108px] cursor-pointer border border-dashed border-[#dcdfe6] rounded-[6px] hover:text-[#409eff] hover:border-[#409eff]" @click="onAddGeometry">
              <div class="icon">
                <el-icon :size="44">
                  <Plus />
                </el-icon>
                <div><span class="text-[14px]">添加几何体模型</span></div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <!-- 外部模型 -->
      <div class="box-border max-w-[380px] bg-[#1b1c23]">
        <div class="box-border flex items-center h-[33px] px-[18px] text-[14px] text-[#cccccc] cursor-pointer">
          <el-space>
            <el-icon>
              <UploadFilled />
            </el-icon>
            <span>外部模型</span>
          </el-space>
        </div>
        <!-- 模型内容 -->
        <div class="overflow-hidden text-[14px] text-white text-center text-ellipsis whitespace-nowrap">
          <span>当前模型:</span>
          <el-tooltip effect="dark" :content="reactiveData.localModelName" placement="top">
            <b>{{ reactiveData.localModelName }}</b>
          </el-tooltip>
        </div>
        <el-upload
          action=""
          accept=".glb,.obj,.gltf,.fbx,.stl"
          class="relative box-border flex justify-center px-[20px] overflow-hidden text-[#8c939d] text-center cursor-pointer"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onUpload"
        >
          <div class="flex items-center justify-center w-[228px] h-[100px] border border-dashed border-[#dcdfe6] rounded-[6px] hover:text-[#409eff] hover:border-[#409eff]">
            <div class="icon">
              <el-icon :size="44">
                <Plus />
              </el-icon>
              <div><span class="text-[14px]">请选择(目前仅支持.glb, .obj, .gltf, .fbx, .stl格式)</span></div>
            </div>
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

