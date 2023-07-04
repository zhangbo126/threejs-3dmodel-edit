<template>
  <div class="edit-box">
    <div class="header">
      <span>背景</span>
      <el-switch v-model="config.visible" @change="onChangeBgSwitch" />
    </div>
    <div class="options" :class="config.visible ? '' : 'disabled'">
      <div class="option" @click="onChangeType(1)">
        <el-space>
          <div class="icon-name">
            <el-space>
              <el-icon><DataAnalysis /></el-icon>
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
            <el-icon size="20px" color="#2a3ff6"><Check /></el-icon>
          </div>
        </el-space>
      </div>
      <!-- 图片 -->
      <div class="option" @click="onChangeType(2)">
        <el-space>
          <div class="icon-name">
            <el-space>
              <el-icon><Picture /></el-icon>
              <span> 图片</span>
            </el-space>
          </div>
          <div class="action-txt">
            <el-link type="primary" @click="onChangeImage">选择图片</el-link>
          </div>
          <div class="check" v-show="config.type == 2">
            <el-icon size="20px" color="#2a3ff6"><Check /></el-icon>
          </div>
        </el-space>
      </div>
      <!-- 图片预览 -->
      <div class="img-privew" v-show="config.type == 2" @click="onChangeImage">
        <el-image
          :src="config.image"
          :style="{ width: '180px', height: '78px' }"
          v-if="config.image"
        >
        </el-image>
        <div class="add-img" @click="onChangeImage" v-else>
          <el-icon color="#fff" size="24px"><Plus /></el-icon>
        </div>
      </div>
      <!-- 全景图 -->
      <div class="option" @click="onChangeType(3)">
        <el-space>
          <div class="icon-name">
            <el-space>
              <el-icon><CameraFilled /></el-icon>
              <span> 全景图</span>
            </el-space>
          </div>
          <div class="action-txt">
            <el-link type="primary" @click="onChangeViewImage">选择图片</el-link>
          </div>
          <div class="check" v-show="config.type == 3">
            <el-icon size="20px" color="#2a3ff6"><Check /></el-icon>
          </div>
        </el-space>
      </div>
      <!-- 全景图预览 -->
      <div class="img-privew" v-show="config.type == 3" @click="onChangeViewImage">
        <el-image
          :src="config.viewImg"
          :style="{ width: '78px', height: '78px' }"
          v-if="config.viewImg"
        >
        </el-image>
        <div class="add-img" v-else>
          <el-icon color="#fff" size="24px"><Plus /></el-icon>
        </div>
      </div>
    </div>
    <!-- 图片选择弹框 -->
    <model-bg-dialog ref="modelBg" @onChangeSuccess="onChangeSuccess"></model-bg-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, computed } from "vue";
import { useStore } from "vuex";
import { PREDEFINE_COLORS } from "@/config/constant";
import ModelBgDialog from "./ModelBgDialog.vue";
const store = useStore();
const config = reactive({
  visible: true,
  type: 1, //1 颜色 2 图片  3全景图
  image: require("@/assets/image/model-bg-9.jpg"),
  viewImg: require("@/assets/image/view-1.png"),
  color: "rgba(212, 223, 224)",
  widthSegments: 0,
});

const state = reactive({
  modelApi: computed(() => {
    return store.state.modelApi;
  }),
});
const modelBg = ref(null);
const predefineColors = PREDEFINE_COLORS;
//切换类型
const onChangeType = (type) => {
  config.type = type;
  switch (type) {
    case 1:
      state.modelApi.onSetSceneColor(config.color);
      break;
    case 2:
      state.modelApi.onSetSceneImage(config.image);
      break;
    case 3:
      state.modelApi.onSetSceneViewImage(config.viewImg);
      break;
    default:
      break;
  }
};
//选择图片
const onChangeImage = () => {
  modelBg.value.showDialog("bg-img");
};
//选择全景图
const onChangeViewImage = () => {
  modelBg.value.showDialog("view-img");
};
// 颜色面板值发生变化
const activeChangeColor = (color) => {
  config.color = color;
  state.modelApi.onSetSceneColor(config.color);
};
//选择颜色
const onChangeColor = () => {
  state.modelApi.onSetSceneColor(config.color);
};

const onChangeBgSwitch = () => {
  const { type, visible, image, viewImg } = config;
  if (!visible) return state.modelApi.onClearSceneBg();
  switch (type) {
    case 1:
      state.modelApi.onSetSceneColor(config.color);
      break;
    case 2:
      state.modelApi.onSetSceneImage(image);
      break;
    case 3:
      state.modelApi.onSetSceneViewImage(viewImg);
      break;
    default:
      break;
  }
};

const onChangeSuccess = ({ url }) => {
  if (config.type == 2) {
    config.image = url;
    state.modelApi.onSetSceneImage(url);
  }
  if (config.type == 3) {
    config.viewImg = url;
    state.modelApi.onSetSceneViewImage(url);
  }
};
</script>
<style lang="scss" scoped>
.add-img {
  border: 1px dashed #414141;
  width: 180px;
  height: 78px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.img-privew {
  cursor: pointer;
  padding: 0px 26px;
}
</style>
