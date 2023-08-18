<template>
  <div class="edit-box">
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
          <el-col :style="{ textAlign: 'center' }" :span="6" v-for="background in backgrundList" :key="background.id">
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
      <el-scrollbar max-height="350px" v-show="config.type == 3">
        <el-row>
          <el-col
            :span="6"
            :style="{ textAlign: 'center' }"
            v-for="view in viewImageList"
            :key="view.id"
          >
            <el-image
              @click="onChangeViewImage(view)"
              class="el-view"
              :class="activeViewImageId == view.id ? 'active' : ''"
              :src="view.url"
              fit="cover"
            />
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>

  </div>
</template>
<script setup>
import { ref, reactive, computed } from "vue";
import { useStore } from "vuex";
import { PREDEFINE_COLORS } from "@/config/constant";
import { backgrundList, viewImageList } from "@/config/model.js";
const store = useStore();
const config = reactive({
  visible: true,
  type: 3, //1 颜色 2 图片  3全景图
  image: require("@/assets/image/model-bg-3.jpg"),
  viewImg: require("@/assets/image/view-4.png"),
  color: "#000",
});
const activeBackgroundId = ref(3);
const activeViewImageId = ref(3);
const state = reactive({
  modelApi: computed(() => {
    return store.state.modelApi;
  }),
});
const optionsDisable = computed(() => {
  const { visible } = config;
  return visible ? "" : "disabled";
});
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
const onChangeImage = ({ id, url }) => {
  config.image = url;
  activeBackgroundId.value = id;
  state.modelApi.onSetSceneImage(url);
};
//选择全景图
const onChangeViewImage = ({ id, url }) => {
  config.viewImg = url;
  activeViewImageId.value = id;
  state.modelApi.onSetSceneViewImage(url);
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

defineExpose({
  config
});
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

.el-img {
  width: 78px;
  height: 40px;
  cursor: pointer;
  margin-bottom: 4px;
}
.el-view {
  width: 60px;
  height: 60px;
  cursor: pointer;
  margin-bottom: 8px;
}
.active {
  border: 2px solid #18c174;
}
</style>
