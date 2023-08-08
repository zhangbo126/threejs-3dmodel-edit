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
      <el-scrollbar max-height="250px">
        <el-row>
          <el-col
            :style="{ textAlign: 'center' }"
            :span="12"
            v-for="model in ordinaryModelList"
            :key="model.id"
          >
            <el-image
              @click="onChangeModel(model)"
              class="el-img"
              :class="activeModelId == model.id ? 'active-model' : ''"
              :src="model.icon"
              fit="cover"
            />
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
    <!-- 动画模型 -->
    <div class="options">
      <div class="option">
        <el-space>
          <el-icon>
            <Orange />
          </el-icon>
          <span>动画模型</span>
        </el-space>
      </div>
      <!-- 模型列表 -->
      <el-scrollbar max-height="250px">
        <el-row>
          <el-col
            :style="{ textAlign: 'center' }"
            :span="12"
            v-for="model in animationModelList"
            :key="model.id"
          >
            <el-image
              @click="onChangeModel(model)"
              class="el-img"
              :class="activeModelId == model.id ? 'active-model' : ''"
              :src="model.icon"
              fit="cover"
            />
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
    <!-- 外部模型 -->
    <div class="options">
      <div class="option">
        <el-space>
          <el-icon>
            <Orange />
          </el-icon>
          <span>外部模型</span>
        </el-space>
      </div>
      <!-- 模型内容 -->
      <div class="file-name">
        <span>当前模型:</span>
        <b>{{ localModelName }}</b>
      </div>

      <el-upload
        action=""
        accept=".glb"
        class="file-box"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="onUpload"
        :before-upload="onBeforeUpload"
      >
        <div class="upload">
          <div class="icon">
            <el-icon :size="44"><Plus /></el-icon>
            <div><span>请选择</span></div>
          </div>
        </div>
      </el-upload>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance, reactive } from "vue";
import { modelList } from "@/config/model.js";
import { useStore } from "vuex";
const store = useStore();
const { $bus } = getCurrentInstance().proxy;
const state = reactive({
  modelApi: computed(() => {
    return store.state.modelApi;
  }),
});
//普通模型
const ordinaryModelList = computed(() => {
  return modelList.filter((v) => !v.animation);
});
// 动画模型
const animationModelList = computed(() => {
  return modelList.filter((v) => v.animation);
});

//当前模型id
const activeModelId = ref(3);

//当前本地模型
const localModelName = ref(null);

//选择模型
const onChangeModel = async (model) => {
  if (model.id == activeModelId.value) return false;
  activeModelId.value = model.id;
  $bus.emit("page-loading", true);
  try {
    const success = await state.modelApi.onSwitchModel(model);
    if (success) {
      $bus.emit("page-loading", false);
      $bus.emit("model-update");
    }
  } catch (err) {
    $bus.emit("page-loading", false);
  }
};

// 选择本地模型文件
const onUpload = async (file) => {
  localModelName.value = file.name;
  const filePath = URL.createObjectURL(file.raw);
  const model = {
    filePath,
    fileType: "glb",
  };
  $bus.emit("page-loading", true);
  try {
    const success = await state.modelApi.onSwitchModel(model);
    if (success) {
      $bus.emit("page-loading", false);
      $bus.emit("model-update");
    }
  } catch (err) {
    $bus.emit("page-loading", false);
  }
};
const onBeforeUpload = (file) => {
  return true;
};
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
    border: 3px solid #18c174;
    opacity: 1;
  }
  .file-box {
    padding: 16px 20px;
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
  }
}
</style>
