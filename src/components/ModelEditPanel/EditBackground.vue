<template>
  <div class="edit-box" v-zLoading="loading">
    <div class="header">
      <span>背景</span>
      <el-switch v-model="config.visible" @change="onChangeBgSwitch" />
    </div>
    <!-- 图片 -->
    <div class="options" :class="optionsDisable">
      <div class="option" @click="onChangeType(2)">
        <el-space>
          <div class="icon-name">
            <el-space>
              <el-icon>
                <Picture />
              </el-icon>
              <span> 图片</span>
            </el-space>
          </div>
          <div class="action-txt">
            <el-button type="primary" link>选择图片</el-button>
          </div>
          <div class="check" v-show="config.type == 2">
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
              class="el-img"
              :class="activeBackgroundId == background.id ? 'active' : ''"
              :src="background.url"
              fit="cover"
            />
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
    <!-- 颜色 -->
    <div class="options" :class="optionsDisable">
      <div class="option" @click="onChangeType(1)">
        <el-space>
          <div class="icon-name">
            <el-space>
              <el-icon>
                <DataAnalysis />
              </el-icon>
              <span> 颜色</span>
            </el-space>
          </div>
          <div class="action">
            <el-color-picker
              :predefine="predefineColors"
              @change="onChangeColor"
              @active-change="activeChangeColor"
              v-model="config.color"
            />
          </div>
          <div class="check" v-show="config.type == 1">
            <el-icon size="20px" color="#2a3ff6">
              <Check />
            </el-icon>
          </div>
        </el-space>
      </div>
    </div>
    <!-- 全景图 -->
    <div class="options" :class="optionsDisable">
      <div class="option" @click="onChangeType(3)">
        <el-space>
          <div class="icon-name">
            <el-space>
              <el-icon>
                <CameraFilled />
              </el-icon>
              <span> 全景图</span>
            </el-space>
          </div>
          <div class="action-txt">
            <el-button type="primary" link>选择图片</el-button>
          </div>
          <div class="check" v-show="config.type == 3">
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
              class="el-view"
              :class="activeViewImageId == view.id ? 'active' : ''"
              :src="view.url"
              fit="cover"
            />
          </el-col>
        </el-row>
        <el-row v-show="config.type == 3">
          <el-col>
            <div class="option">
              <div class="icon-name">
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
                <div class="texture-add">
                  <div class="icon">
                    <el-tooltip effect="dark" content="该功能仅作预览，数据无法保存" placement="top">
                      <el-icon size="60">
                        <UploadFilled />
                      </el-icon>
                    </el-tooltip>
                    <span>加载外部全景图</span>
                  </div>
                </div>
              </el-upload>
              <el-upload action="" accept=".mp4" :show-file-list="false" :auto-upload="false" :on-change="onUploadTextureVideo">
                <div class="texture-add">
                  <div class="icon">
                    <el-tooltip effect="dark" content="该功能仅作预览，数据无法保存" placement="top">
                      <el-icon size="60">
                        <VideoCameraFilled />
                      </el-icon>
                    </el-tooltip>
                    <span>加载外部视频</span>
                  </div>
                </div>
              </el-upload>
            </el-space>
          </el-col>
        </el-row>
        <el-row v-show="config.type == 3">
          <el-col>
            <div class="options">
              <div class="option">
                <el-space>
                  <div class="grid-txt">
                    <el-button type="primary" link>强度</el-button>
                  </div>
                </el-space>
                <div class="grid-sidle">
                  <el-slider show-input @input="onChangeViewConfig" v-model="config.intensity" :min="0" :max="1" :step="0.01" />
                </div>
              </div>
              <div class="option">
                <el-space>
                  <div class="grid-txt">
                    <el-button type="primary" link> 模糊</el-button>
                  </div>
                </el-space>
                <div class="grid-sidle">
                  <el-slider show-input @input="onChangeViewConfig" v-model="config.blurriness" :min="0" :max="1" :step="0.01" />
                </div>
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
      store.modelApi.onSetSceneColor(config.color);
      break;
    case 2:
      store.modelApi.onSetSceneImage(config.image);
      break;
    case 3:
      store.modelApi.onSetSceneViewImage(config);
      break;
    default:
      break;
  }
};
//选择图片
const onChangeImage = ({ id, url }) => {
  config.image = url;
  activeBackgroundId.value = id;
  store.modelApi.onSetSceneImage(url);
};
//选择全景图
const onChangeViewImage = async ({ id, url }) => {
  try {
    loading.value = true;
    config.viewImg = url;
    activeViewImageId.value = id;
    await store.modelApi.onSetSceneViewImage(config);
  } finally {
    loading.value = false;
    ElMessage.success("操作成功");
  }
};

// 上传外部图片
const onUploadTexture = async file => {
  const filePath = URL.createObjectURL(file.raw);
  await store.modelApi.onSetStorageViewImage(filePath, getFileType(file.name));
  URL.revokeObjectURL(filePath);
  ElMessage.success("操作成功");
};

//上传外部视频
const onUploadTextureVideo = async file => {
  await store.modelApi.onSetStorageViewVideo(file);
  ElMessage.success("操作成功");
};

// 颜色面板值发生变化
const activeChangeColor = color => {
  config.color = color;
  store.modelApi.onSetSceneColor(config.color);
};
//选择颜色
const onChangeColor = () => {
  store.modelApi.onSetSceneColor(config.color);
};

// 修改全景图配置
const onChangeViewConfig = () => {
  store.modelApi.onSetSceneViewConfig(config);
};

const onChangeBgSwitch = () => {
  const { type, visible, image, viewImg } = config;
  if (!visible) return store.modelApi.onSetSceneColor("#000");
  switch (type) {
    case 1:
      store.modelApi.onSetSceneColor(config.color);
      break;
    case 2:
      store.modelApi.onSetSceneImage(image);
      break;
    case 3:
      store.modelApi.onSetSceneViewImage(config);
      break;
    default:
      break;
  }
};

defineExpose({
  config
});
</script>
<style lang="scss" scoped>
.add-img {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 78px;
  cursor: pointer;
  border: 1px dashed #414141;
}
.img-privew {
  padding: 0 26px;
  cursor: pointer;
}
.el-img {
  width: 78px;
  height: 40px;
  margin-bottom: 4px;
  cursor: pointer;
}
.el-view {
  width: 60px;
  height: 60px;
  margin-bottom: 8px;
  cursor: pointer;
}
.active {
  border: 2px solid #18c174;
}
.texture-add {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 118px;
  height: 108px;
  cursor: pointer;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  .icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #ffffff;
    span {
      font-size: 14px;
    }
  }
  &:hover {
    border-color: #409eff;
    .icon {
      color: #409eff;
    }
  }
}
</style>
