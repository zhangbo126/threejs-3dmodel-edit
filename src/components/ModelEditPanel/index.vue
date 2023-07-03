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
const panelTabs = [
  {
    name: "背景",
    key: "EditBackground",
    icon: "Picture",
  },
  {
    name: "场景",
    key: "EditScene",
    icon: "DataAnalysis",
  },
];
const activeTab = ref("EditBackground");
</script>
<style lang="less" scoped>
.model-panel {
  background-color: #1b1c23;
  min-width: 350px;
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

<style lang="less">
.edit-box {
  height: calc(100vh - 89px);
  .header {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #33343f;
    color: #ccc;
    padding: 0px 20px;
  }
  .options {
    background-color: #1b1c23;
    padding: 0px 10px;

    .option {
      cursor: pointer;
      color: #fff;
      display: flex;
      align-items: center;
      height: 40px;
      .icon-name {
        display: flex;
        align-items: center;
      }
    }
   
  }
}
</style>
