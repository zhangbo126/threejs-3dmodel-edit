<template>
  <div class="model-choose">
    <div class="header">
      <span>模型列表</span>
    </div>
    <!-- 普通模型 -->
    <div class="options">
      <div class="option">
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
          <el-col :style="{ textAlign: 'center' }" :span="12" v-for="model in ordinaryModelList" :key="model.id">
            <el-image draggable="false" @click.prevent="onChangeModel(model)" class="el-img"
              :class="activeModelId == model.id ? 'active-model' : ''" :src="model.icon" fit="cover" />
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
    <!-- 动画模型 -->
    <div class="options">
      <div class="option">
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
          <el-col :style="{ textAlign: 'center' }" :span="12" v-for="model in animationModelList" :key="model.id">
            <el-image draggable="false" @click="onChangeModel(model)" class="el-img"
              :class="activeModelId == model.id ? 'active-model' : ''" :src="model.icon" fit="cover" />
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
    <!-- 几何体模型 -->
    <div class="options">
      <div class="option">
        <el-space>
          <el-icon>
            <SwitchFilled />
          </el-icon>
          <span>几何体模型</span>
          <span :style="{ color: '#18c174 ' }" v-if="geometryVisable">(可拖拽添加多个)</span>
        </el-space>
      </div>
      <!-- 模型列表 -->
      <el-scrollbar max-height="120px">
        <el-row v-if="geometryVisable">
          <el-col :style="{ textAlign: 'center' }" :span="8" v-for="model in geometryModelList" :key="model.type">
            <div class="geometry" :class="activeModelId == model.id ? 'active-model' : ''" draggable="true"
              @dragstart="(e) => onDragstart(e, model)" @drag="(e) => onDrag(e)">
              <div class="geometry-name">
                <el-tooltip effect="dark" :content="`${model.name}:${model.type}`" placement="top">
                  <b> {{ model.name }}</b>
                </el-tooltip>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="geometry-box" v-else>
          <div class="geometry-add" @click="onAddGeometry">
            <div class="icon">
              <el-icon :size="44">
                <Plus />
              </el-icon>
              <div><span>添加几何体模型</span></div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <!-- 外部模型 -->
    <div class="options">
      <div class="option">
        <el-space>
          <el-icon>
            <UploadFilled />
          </el-icon>
          <span>外部模型</span>
        </el-space>
      </div>
      <!-- 模型内容 -->
      <div class="file-name">
        <span>当前模型:</span>
        <el-tooltip effect="dark" :content="localModelName" placement="top">
          <b>{{ localModelName }}</b>
        </el-tooltip>
      </div>
      <el-upload action="" accept=".glb,.obj,.gltf,.fbx" class="file-box" :show-file-list="false" :auto-upload="false"
        :on-change="onUpload">
        <div class="upload">
          <div class="icon">
            <el-icon :size="44">
              <Plus />
            </el-icon>
            <div><span>请选择(目前仅支持.glb, .obj, .gltf, .fbx格式)</span></div>
          </div>
        </div>
      </el-upload>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance } from "vue";
import { modelList, geometryModelList } from "@/config/model.js";
import { useMeshEditStore } from '@/store/meshEditStore'
import { getFileType } from "@/utils/utilityFunction.js";
const store = useMeshEditStore();
const { $bus } = getCurrentInstance().proxy;

//普通模型
const ordinaryModelList = computed(() => {
  return modelList.filter((v) => !v.animation);
});
// 动画模型
const animationModelList = computed(() => {
  return modelList.filter((v) => v.animation);
});

//当前模型id
const activeModelId = ref(9);
const geometryVisable = ref(false);
// 当前模型信息
const activeModel = ref({
  name: "变形金刚（3）",
  fileType: "glb",
  id: 9,
  animation: false,
  filePath: "threeFile/glb/glb-9.glb",
  icon: require("@/assets/model-icon/4.png"),
  decomposeName: "transformers_3",
  key: "transformers-3",
});
//当前本地模型
const localModelName = ref(null);

//选择模型
const onChangeModel = async (model) => {
  if (model.id == activeModelId.value) return false;
  geometryVisable.value = false;
  activeModelId.value = model.id;
  localModelName.value = null;
  activeModel.value = model;
  $bus.emit("page-loading", true);
  try {
    const { load } = await store.modelApi.onSwitchModel(model);
    if (load) {
      $bus.emit("model-update");
      $bus.emit("page-loading", false);
    }
  } catch (err) {
    $bus.emit("page-loading", false);
  }
};

// 添加几何模型
const onAddGeometry = async () => {
  geometryVisable.value = true;
  localModelName.value = null;
  activeModelId.value = null;
  activeModel.value = {};
  store.modelApi.clearSceneModel();
};

// 拖拽几何模型开始
const onDragstart = (e, model) => {
  store.modelApi.setDragGeometryModel(model);
};
// 拖拽中
const onDrag = (event) => {
  event.preventDefault();
};

// 选择本地模型文件
const onUpload = async (file) => {
  localModelName.value = file.name;
  const filePath = URL.createObjectURL(file.raw);

  const model = {
    filePath,
    fileType: getFileType(file.name),
  };
  $bus.emit("page-loading", true);
  try {
    const { load, filePath } = await store.modelApi.onSwitchModel(model);
    // TODO: 加载成功之后手动释放 否则会造成内存浪费
    URL.revokeObjectURL(filePath);
    if (load) {
      $bus.emit("model-update");
      $bus.emit("page-loading", false);
      activeModelId.value = null;
      geometryVisable.value = false;
      activeModel.value = {};

    }
  } catch (err) {
    localModelName.value = null;
    $bus.emit("page-loading", false);
  }
};

defineExpose({
  activeModel,
});
</script>

<style lang="scss">
.model-choose {
  min-width: 305px;
  height: calc(100vh - 35px) !important;
  background-color: #1b1c23;

  .el-img {
    width: 145px;
    height: 88px;
    cursor: pointer;
    margin-bottom: 4px;
    box-sizing: border-box;
    opacity: 0.5;
  }

  .active-model {
    border: 3px solid #18c174 !important;
    opacity: 1;
  }

  .geometry {
    color: #fff;
    cursor: all-scroll;
    font-size: 12px;
    text-align: center;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 1px solid #dcdfe6;
    margin: 4px 2px;
  }

  .geometry-box {
    padding: 0px 20px;
    color: #8c939d;
    box-sizing: border-box;
    text-align: center;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;

    .geometry-add {
      width: 228px;
      height: 108px;
      border: 1px dashed #dcdfe6;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      cursor: pointer;

      .icon {
        span {
          font-size: 14px;
        }
      }

      &:hover {
        border-color: #409eff;
        color: #409eff;
      }
    }
  }

  .file-box {
    padding: 10px 20px;
    color: #8c939d;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;

    .upload {
      width: 228px;
      height: 128px;
      border: 1px dashed #dcdfe6;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;

      .icon {
        span {
          font-size: 14px;
        }
      }

      &:hover {
        border-color: #409eff;
        color: #409eff;
      }
    }
  }

  .file-name {
    color: #fff;
    text-align: center;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
