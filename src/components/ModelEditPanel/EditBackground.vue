<template>
  <div class="h-[calc(100vh-90px)]" v-zLoading="loading">
    <div
      class="box-border flex items-center justify-between w-full h-[35px] px-[20px] text-[#cccccc] bg-[#33343f] border-t border-b border-[#1b1c23]"
    >
      <span>背景</span>
      <el-switch v-model="config.visible" @change="onChangeBgSwitch" />
    </div>
    <!-- 图片 -->
    <div class="box-border max-w-[380px] bg-[#1b1c23]" :class="optionsDisable">
      <div
        class="box-border flex items-center h-[33px] px-[18px] text-[14px] text-[#cccccc] cursor-pointer"
        @click="onChangeType(2)"
      >
        <el-space>
          <div class="flex items-center">
            <el-space>
              <el-icon>
                <Picture />
              </el-icon>
              <span> 图片</span>
            </el-space>
          </div>
          <div>
            <el-button type="primary" link>选择图片</el-button>
          </div>
          <div v-show="config.type == 2">
            <el-icon size="20px" color="#2a3ff6">
              <Check />
            </el-icon>
          </div>
        </el-space>
      </div>
      <el-scrollbar max-height="250px" v-show="config.type == 2">
        <el-row>
          <el-col :style="{ textAlign: 'center' }" :span="6" v-for="background in backgroundList" :key="background.id">
            <el-image
              @click="onChangeImage(background)"
              class="w-[78px] h-[40px] mb-[4px] cursor-pointer"
              :class="activeBackgroundId == background.id ? 'border-[2px] border-[#18c174]' : ''"
              :src="background.url"
              fit="cover"
            />
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
    <!-- 颜色 -->
    <div class="box-border max-w-[380px] bg-[#1b1c23]" :class="optionsDisable">
      <div
        class="box-border flex items-center h-[33px] px-[18px] text-[14px] text-[#cccccc] cursor-pointer"
        @click="onChangeType(1)"
      >
        <el-space>
          <div class="flex items-center">
            <el-space>
              <el-icon>
                <DataAnalysis />
              </el-icon>
              <span> 颜色</span>
            </el-space>
          </div>
          <div>
            <el-color-picker
              :predefine="predefineColors"
              @change="onChangeColor"
              @active-change="activeChangeColor"
              v-model="config.color"
            />
          </div>
          <div v-show="config.type == 1">
            <el-icon size="20px" color="#2a3ff6">
              <Check />
            </el-icon>
          </div>
        </el-space>
      </div>
    </div>
    <!-- 全景图 -->
    <div class="box-border max-w-[380px] bg-[#1b1c23]" :class="optionsDisable">
      <div
        class="box-border flex items-center h-[33px] px-[18px] text-[14px] text-[#cccccc] cursor-pointer"
        @click="onChangeType(3)"
      >
        <el-space>
          <div class="flex items-center">
            <el-space>
              <el-icon>
                <CameraFilled />
              </el-icon>
              <span> 全景图</span>
            </el-space>
          </div>
          <div>
            <el-button type="primary" link>选择图片</el-button>
          </div>
          <div v-show="config.type == 3">
            <el-icon size="20px" color="#2a3ff6">
              <Check />
            </el-icon>
          </div>
        </el-space>
      </div>
      <el-scrollbar max-height="600px" v-show="config.type == 3">
        <el-row>
          <el-col :span="6" :style="{ textAlign: 'center' }" v-for="view in viewImageList" :key="view.id">
            <el-image
              @click="onChangeViewImage(view)"
              class="w-[60px] h-[60px] mb-[8px] cursor-pointer"
              :class="activeViewImageId == view.id ? 'border-[2px] border-[#18c174]' : ''"
              :src="view.url"
              fit="cover"
            />
          </el-col>
        </el-row>
        <el-row v-show="config.type == 3">
          <el-col>
            <div class="box-border flex items-center h-[33px] px-[18px] text-[14px] text-[#cccccc] cursor-pointer">
              <div class="flex items-center">
                <el-space>
                  <span>外部资源</span>
                </el-space>
              </div>
            </div>
          </el-col>
          <el-col :span="10" :offset="4">
            <el-space spacer="20">
              <el-upload
                action=""
                accept=".jpg,.png,.hdr"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="onUploadTexture"
              >
                <div
                  class="flex items-center justify-center w-[118px] h-[108px] cursor-pointer border border-dashed border-[#dcdfe6] rounded-[6px] hover:border-[#409eff]"
                >
                  <div class="flex flex-col items-center text-white hover:text-[#409eff]">
                    <el-tooltip effect="dark" content="该功能仅作预览，数据无法保存" placement="top">
                      <el-icon size="60">
                        <UploadFilled />
                      </el-icon>
                    </el-tooltip>
                    <span class="text-[14px]">加载外部全景图</span>
                  </div>
                </div>
              </el-upload>
              <el-upload action="" accept=".mp4" :show-file-list="false" :auto-upload="false" :on-change="onUploadTextureVideo">
                <div
                  class="flex items-center justify-center w-[118px] h-[108px] cursor-pointer border border-dashed border-[#dcdfe6] rounded-[6px] hover:border-[#409eff]"
                >
                  <div class="flex flex-col items-center text-white hover:text-[#409eff]">
                    <el-tooltip effect="dark" content="该功能仅作预览，数据无法保存" placement="top">
                      <el-icon size="60">
                        <VideoCameraFilled />
                      </el-icon>
                    </el-tooltip>
                    <span class="text-[14px]">加载外部视频</span>
                  </div>
                </div>
              </el-upload>
            </el-space>
          </el-col>
        </el-row>
        <el-row v-show="config.type == 3">
          <el-col>
            <div class="box-border max-w-[380px] bg-[#1b1c23]">
              <div class="box-border flex items-center my-[10px] h-[33px] px-[18px] text-[14px] text-[#cccccc] cursor-pointer">
                <el-button type="primary" link>强度</el-button>
                <el-slider
                  class="!w-full"
                  show-input
                  @input="onChangeViewConfig"
                  v-model="config.intensity"
                  :min="0"
                  :max="1"
                  :step="0.01"
                />
              </div>
              <div class="box-border flex items-center h-[33px] px-[18px] text-[14px] text-[#cccccc] cursor-pointer">
                <el-button type="primary" link> 模糊</el-button>
                <el-slider
                  class="!w-full"
                  show-input
                  @input="onChangeViewConfig"
                  v-model="config.blurriness"
                  :min="0"
                  :max="1"
                  :step="0.01"
                />
              </div>
            </div>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed } from "vue";
import { useMeshEditStore } from "@/store/meshEditStore";
import { PREDEFINE_COLORS } from "@/config/constant";
import { backgroundList, viewImageList } from "@/config/model.js";
import { getFileType, getAssetsFile } from "@/utils/utilityFunction";
import { ElMessage } from "element-plus";

const store = useMeshEditStore();
const config = reactive({
  visible: true,
  type: 3, //1 颜色 2 图片  3全景图
  image: getAssetsFile("image/model-bg-3.jpg"),
  viewImg: getAssetsFile("image/view-4.png"),
  color: "#000",
  blurriness: 1,
  intensity: 1
});

const loading = ref(false);
const activeBackgroundId = ref(3);
const activeViewImageId = ref(3);

const optionsDisable = computed(() => {
  const { visible } = config;
  return visible ? "" : "disabled";
});
const predefineColors = PREDEFINE_COLORS;
//切换类型
const onChangeType = type => {
  Object.assign(config, {
    type,
    intensity: 1,
    blurriness: 1
  });
  switch (type) {
    case 1:
      store.modelApi.backgroundModules.onSetSceneColor(config.color);
      break;
    case 2:
      store.modelApi.backgroundModules.onSetSceneImage(config.image);
      break;
    case 3:
      store.modelApi.backgroundModules.onSetSceneViewImage(config);
      break;
    default:
      break;
  }
};
//选择图片
const onChangeImage = ({ id, url }) => {
  config.image = url;
  activeBackgroundId.value = id;
  store.modelApi.backgroundModules.onSetSceneImage(url);
};
//选择全景图
const onChangeViewImage = async ({ id, url }) => {
  try {
    loading.value = true;
    config.viewImg = url;
    activeViewImageId.value = id;
    await store.modelApi.backgroundModules.onSetSceneViewImage(config);
  } finally {
    loading.value = false;
    ElMessage.success("操作成功");
  }
};

// 上传外部图片
const onUploadTexture = async file => {
  const filePath = URL.createObjectURL(file.raw);
  await store.modelApi.backgroundModules.onSetStorageViewImage(filePath, getFileType(file.name));
  URL.revokeObjectURL(filePath);
  ElMessage.success("操作成功");
};

//上传外部视频
const onUploadTextureVideo = async file => {
  await store.modelApi.backgroundModules.onSetStorageViewVideo(file);
  ElMessage.success("操作成功");
};

// 颜色面板值发生变化
const activeChangeColor = color => {
  config.color = color;
  store.modelApi.backgroundModules.onSetSceneColor(config.color);
};
//选择颜色
const onChangeColor = () => {
  store.modelApi.backgroundModules.onSetSceneColor(config.color);
};

// 修改全景图配置
const onChangeViewConfig = () => {
  store.modelApi.backgroundModules.onSetSceneViewConfig(config);
};

const onChangeBgSwitch = () => {
  const { type, visible, image, viewImg } = config;
  if (!visible) return store.modelApi.backgroundModules.onSetSceneColor("#000");
  switch (type) {
    case 1:
      store.modelApi.backgroundModules.onSetSceneColor(config.color);
      break;
    case 2:
      store.modelApi.backgroundModules.onSetSceneImage(image);
      break;
    case 3:
      store.modelApi.backgroundModules.onSetSceneViewImage(config);
      break;
    default:
      break;
  }
};

defineExpose({
  config
});
</script>
