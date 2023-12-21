<template>
  <div class="model-panel">
    <ul class="panel-tabs">
      <li v-for="tab in panelTabs" :key="tab.key" :class="activeTab == tab.key ? 'active' : ''"
        @click="activeTab = tab.key">
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
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import EditBackground from "./EditBackground.vue";
import EditMaterial from "./EditMaterial.vue";
import EditAnimation from "./EditAnimation.vue";
import EditAttribute from "./EditAttribute.vue";
import EditLight from "./EditLight.vue";
import EditLaterStage from "./EditLaterStage.vue";
import EditGeometry from "./EditGeometry.vue";
import { useMeshEditStore } from '@/store/meshEditStore'
import { indexedDB } from '@/utils/indexedDB'
const panelTabs = [
  {
    name: "背景",
    key: "EditBackground",
    icon: "Picture",
  },
  {
    name: "材质",
    key: "EditMaterial",
    icon: "DataAnalysis",
  },
  {
    name: "后期/操作",
    key: "EditLaterStage",
    icon: "MagicStick",
  },
  {
    name: "灯光",
    key: "EditLight",
    icon: "Sunrise",
  },
  {
    name: "模型动画",
    key: "EditAnimation",
    icon: "VideoCameraFilled",
  },
  {
    name: "辅助线/轴配置",
    key: "EditAttribute",
    icon: "Box",
  },
  {
    name: "几何体模型配置",
    key: "EditGeometry",
    icon: "Cellphone",
  },
];
const activeTab = ref("EditMaterial");
const background = ref(null);
const material = ref(null);
const animation = ref(null);
const attribute = ref(null);
const light = ref(null);
const stage = ref(null);
const geometry = ref(null)
const store = useMeshEditStore();

// 监听键盘事件 ctrl +z
const addEventListenerKeydown = async (event) => {
  if (event.ctrlKey && event.key === 'z') {
    const res = await indexedDB.getArray()
    if (Array.isArray(res)) {
      if(res.length==1){
        store.modelApi.initMaterial()
      }
      const revokeData = res[res.length - 2]
      if(!revokeData) return false
      switch (revokeData.tab) {
        case 'EditMaterial':
          // store.modelApi.materialRevoke(revokeData)
          material.value.materialRevoke(revokeData)
          indexedDB.removeArray(revokeData.key)
          break;
        case 'EditBackground':
          break;
        case 'EditLaterStage':
          break;
        case 'EditAnimation':
          break;
        case 'EditAttribute':
          break;
        default:
          break;
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', addEventListenerKeydown);
})

onUnmounted(() => {
  window.removeEventListener('keydown', addEventListenerKeydown);

})

// 获取所有面板配置
const getPanelConfig = () => {
  return {
    background: background.value.config,
    material: material.value.getMeshConfig(),
    animation: animation.value.config,
    attribute: attribute.value.getAttrbuteConfig(),
    light: light.value.config,
    stage: stage.value.getStageConfig(),
  };
};
defineExpose({
  getPanelConfig,
});
</script>
<style lang="scss" scoped>
.model-panel {
  background-color: #1b1c23;
  min-width: 380px;
  height: calc(100vh - 35px);

  .panel-tabs {
    display: flex;

    .active {
      background-color: #4d57fd;
    }

    li {
      cursor: pointer;
      color: #888;
      background: #272830;
      padding: 10px;
      border-right: 1px solid #0a0a0a;
      display: flex;
      align-items: center;

      .tab {
        line-height: initial;
      }
    }
  }
}
</style>
