<template>
  <div class="model-panel">
    <ul class="panel-tabs">
      <li v-for="tab in panelTabs" :key="tab.key" :class="activeTab == tab.key ? 'active' : ''" @click="activeTab = tab.key">
        <el-tooltip effect="light" :content="tab.name" placement="top">
          <div class="tab">
            <el-icon size="20px" :color="activeTab == tab.key ? '#fff' : ''">
              <component :is="tab.icon"></component>
            </el-icon>
          </div>
        </el-tooltip>
      </li>
    </ul>

    <div class="panel-edit">
      <el-scrollbar max-height="calc(100vh - 70px)">
        <!-- 背景 -->
        <div v-show="activeTab == 'EditBackground'">
          <edit-background ref="background"></edit-background>
        </div>
        <!-- 材质 -->
        <div v-show="activeTab == 'EditMaterial'">
          <edit-material ref="material"></edit-material>
        </div>
        <!-- 后期 -->
        <div v-show="activeTab == 'EditLaterStage'">
          <edit-later-stage ref="stage"></edit-later-stage>
        </div>
        <!-- 动画 -->
        <div v-show="activeTab == 'EditAnimation'">
          <edit-animation ref="animation"></edit-animation>
        </div>
        <!-- 灯光 -->
        <div v-show="activeTab == 'EditLight'">
          <edit-light ref="light"></edit-light>
        </div>
        <!-- 属性 -->
        <div v-show="activeTab == 'EditAttribute'">
          <edit-attribute ref="attribute"></edit-attribute>
        </div>
        <!-- 几何体配置 -->
        <div v-show="activeTab == 'EditGeometry'">
          <edit-geometry ref="geometry"></edit-geometry>
        </div>
        <!-- 标签配置 -->
        <div v-show="activeTab == 'EditTags'">
          <edit-tags ref="tags"></edit-tags>
        </div>
        <!-- 多模型添加 -->
        <div v-show="activeTab == 'EditMoreModel'">
          <edit-more-model ref="more"></edit-more-model>
        </div>
        <!-- 着色器 -->
        <div v-show="activeTab == 'EditShader'">
          <edit-shader ref="shader"></edit-shader>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import EditBackground from "./EditBackground.vue";
import EditMaterial from "./EditMaterial.vue";
import EditAnimation from "./EditAnimation.vue";
import EditAttribute from "./EditAttribute.vue";
import EditLight from "./EditLight.vue";
import EditLaterStage from "./EditLaterStage.vue";
import EditGeometry from "./EditGeometry.vue";
import EditMoreModel from "./EditMoreModel.vue";
import EditTags from "./EditTags.vue";
import EditShader from "./EditShader.vue";
const { $bus } = getCurrentInstance().proxy;

const panelTabs = [
  {
    name: "背景",
    key: "EditBackground",
    icon: "Picture"
  },
  {
    name: "材质",
    key: "EditMaterial",
    icon: "DataAnalysis"
  },
  {
    name: "后期/操作",
    key: "EditLaterStage",
    icon: "MagicStick"
  },
  {
    name: "灯光",
    key: "EditLight",
    icon: "Sunrise"
  },
  {
    name: "模型动画",
    key: "EditAnimation",
    icon: "VideoCameraFilled"
  },
  {
    name: "辅助线/轴配置",
    key: "EditAttribute",
    icon: "Box"
  },
  {
    name: "几何体模型配置",
    key: "EditGeometry",
    icon: "Cellphone"
  },
  {
    name: "标签配置",
    key: "EditTags",
    icon: "CollectionTag"
  },
  {
    name: "多模型配置",
    key: "EditMoreModel",
    icon: "Money"
  },
  {
    name: "着色器",
    key: "EditShader",
    icon: "Loading"
  },
];

const activeTab = ref("EditMaterial");
const background = ref(null);
const material = ref(null);
const animation = ref(null);
const attribute = ref(null);
const light = ref(null);
const stage = ref(null);
const geometry = ref(null);
const tags = ref(null);
const more = ref(null);
const shader = ref(null);
onMounted(() => {
  $bus.on("update-tab", chooseTab => {
    activeTab.value = chooseTab;
  });
});

// 获取所有面板配置
const getPanelConfig = () => {
  return {
    background: background.value.config,
    material: material.value.getMeshConfig(),
    animation: animation.value.config,
    attribute: attribute.value.getAttributeConfig(),
    light: light.value.config,
    stage: stage.value.getStageConfig(),
    tags: tags.value.config
  };
};
defineExpose({
  getPanelConfig
});
</script>
<style lang="scss" scoped>
.model-panel {
  min-width: 380px;
  height: calc(100vh - 35px);
  background-color: #1b1c23;
  .panel-tabs {
    display: flex;
    .active {
      background-color: #4d57fd;
    }
    li {
      display: flex;
      align-items: center;
      padding: 6px 8px;
      color: #888888;
      cursor: pointer;
      background: #272830;
      border-right: 1px solid #0a0a0a;
      .tab {
        line-height: initial;
      }
    }
  }
  .many-model {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin: 5px;
    .model-label {
      font-size: 14px;
      color: #ffffff;
    }
  }
}
</style>
