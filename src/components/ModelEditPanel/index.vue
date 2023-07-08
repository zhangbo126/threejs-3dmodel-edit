<template>
  <div class="model-panel">
    <ul class="panel-tabs">
      <li
        v-for="tab in panelTabs"
        :key="tab.key"
        :class="activeTab == tab.key ? 'active' : ''"
        @click="activeTab = tab.key"
      >
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
        <edit-background></edit-background>
      </div>
      <!-- 动画 -->
      <div v-show="activeTab == 'EditAnimation'">
        <edit-animation></edit-animation>
      </div>
      <!-- 属性 -->
      <div v-show="activeTab == 'EditAttribute'">
        <edit-attribute></edit-attribute>
      </div>
      <!-- 灯光 -->
      <div v-show="activeTab == 'EditLight'">
        <edit-light></edit-light>
      </div>
      <!-- 场景 -->
      <div v-show="activeTab == 'EditScene'">
        <edit-scene></edit-scene>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import EditBackground from "./EditBackground.vue";
import EditScene from "./EditScene.vue";
import EditAnimation from "./EditAnimation.vue";
import EditAttribute from "./EditAttribute.vue";
import EditLight from "./EditLight.vue";
const panelTabs = [
  {
    name: "背景",
    key: "EditBackground",
    icon: "Picture",
  },
  {
    name: "模型动画",
    key: "EditAnimation",
    icon: "VideoCameraFilled",
  },
  {
    name: "模型属性",
    key: "EditAttribute",
    icon: "Box",
  },
  {
    name: "灯光",
    key: "EditLight",
    icon: "Sunrise",
  },
  {
    name: "场景",
    key: "EditScene",
    icon: "DataAnalysis",
  },
];
const activeTab = ref("EditLight");
</script>
<style lang="scss" scoped>
.model-panel {
  background-color: #1b1c23;
  min-width: 380px;
  height: calc(100vh - 45px);
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

