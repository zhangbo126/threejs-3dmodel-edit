<template>
  <div class="model-base">
    <!-- 头部区域 -->
    <header class="base-header">
      <div class="lf-box">
        <el-button type="primary" @click="$router.push({ path: '/' })" icon="DArrowLeft"
          >返回编辑器</el-button
        >
      </div>
      <div class="center-box">
        <el-space>
          <el-icon>
            <Film />
          </el-icon>
          <p>3D组件模型库</p>
        </el-space>
      </div>
      <div class="lr-box">
        <el-space>
          <el-button type="primary" icon="Tickets" @click="onSavaDragdata"
            >保存数据</el-button
          >
        </el-space>
      </div>
    </header>
    <!-- 内容区 -->
    <div class="base-container">
      <el-scrollbar :max-height="'calc(100vh - 45px)'" class="base-menu">
        <ul class="menu-list">
          <li
            v-for="model in modelBaseList"
            :key="model.fileInfo.id"
            draggable="true"
            @dragstart="(e) => onDragStart(e, model)"
            @drag="(e) => onDrag(e)"
            @dragend="onDragEnd"
          >
            <div class="model-image">
              <el-image fit="scale-down" :src="model.fileInfo.icon"></el-image>
            </div>
            <div class="model-info">
              <div class="model-name">
                <el-tooltip effect="dark" :content="model.fileInfo.name" placement="top">
                  <span>{{ model.fileInfo.name }}</span>
                </el-tooltip>
              </div>
            </div>
          </li>
        </ul>
      </el-scrollbar>
      <div id="drag-content">
        <div class="content" @drop="onDrop" @dragover.prevent>
          <draggable-container :adsorbParent="true" :disabled="true">
            <draggable-resizable-item
              @onDragActived="onDragActived"
              @onDragDeactivated="onDragDeactivated"
              v-for="drag in dragModelList"
              :key="drag.modelKey"
              :config="drag"
            ></draggable-resizable-item>
          </draggable-container>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { DraggableContainer } from "vue3-draggable-resizable";
import DraggableResizableItem from "@/components/DraggableResizableItem/index";
import {
  MODEL_BASE_DATA,
  MODEL_DEFAULT_CONFIG,
  MODEL_BASE_DRAGE_DATA,
} from "@/config/constant";
import { modelList } from "@/config/model";
import { deepCopy, onlyKey } from "@/utils/utilityFunction";
import { ref, getCurrentInstance, onMounted, nextTick } from "vue";
import { ElMessage } from "element-plus";
const { $local, $bus } = getCurrentInstance().proxy;
// 左侧模板库数据
const modelBaseList = ref([]);
//可拖拽模型列表
const dragModelList = ref([]);
// 当前选中的内容
const dragActive = ref(null);
// 拖拽开始
const onDragStart = (event, model) => {
  dragActive.value = deepCopy(model);
};
// 拖拽中
const onDrag = (event) => {
  event.preventDefault();
};
// 拖拽结束
const onDragEnd = (event) => {
  event.preventDefault();
  const { x, y } = dragActive.value;
  if (!x || !y) {
    dragActive.value = null;
    return false;
  }
  dragActive.value.width = 520;
  dragActive.value.height = 360;
  // 生成当前拖拽模型的唯一值
  dragActive.value.modelKey = onlyKey(20, 2);
  dragModelList.value.push(dragActive.value);
  dragActive.value = null;
  if(dragModelList.value.length>=8){
    ElMessage.warning('请注意:当前面板模型组件加载过多!!!')
  }
};
// 拖拽完成
const onDrop = (event) => {
  event.preventDefault();
  // 设置模型拖放位置
  const container = document.querySelector("#drag-content").getBoundingClientRect();
  const x = event.clientX - container.left - 520 / 2;
  const y = event.clientY - container.top - 360 / 2;
  dragActive.value.x = x;
  dragActive.value.y = y;
};

// 选中拖拽元素
const onDragActived = (drag) => {
  dragActive.value = drag;
};
// 取消选中拖拽元素
const onDragDeactivated = (modelKey) => {
  if (modelKey == dragActive.value.modelKey) {
    dragActive.value = null;
  }
};

// 初始化模型库数据
const initModelBaseData = () => {
  const modelBase = $local.get(MODEL_BASE_DATA);
  // 如果是首次加载需要设置模型库初始数据值
  if (!Array.isArray(modelBase)) {
    let modelBaseData = [];
    modelList.forEach((v) => {
      modelBaseData.push({
        ...MODEL_DEFAULT_CONFIG,
        fileInfo: { ...v },
      });
    });
    $local.set(MODEL_BASE_DATA, modelBaseData);
  }
  modelBaseList.value = $local.get(MODEL_BASE_DATA);
};

// 获取拖拽数据列表
const getDragDataList = () => {
  dragModelList.value = $local.get(MODEL_BASE_DRAGE_DATA) || [];
};

// 保存拖拽数据
const onSavaDragdata = () => {
  $local.set(MODEL_BASE_DRAGE_DATA, dragModelList.value);
  ElMessage.success('更新成功')
};

// 监听缓存数据变化
onMounted(async () => {
  nextTick(() => {
    initModelBaseData();
    getDragDataList();
  });
  // 监听键盘按下 delete 键
  window.addEventListener("keydown", (event) => {
    if (event.keyCode === 46 && event.key == "Delete" && dragActive.value) {
      const { modelKey } = dragActive.value;
      dragModelList.value = dragModelList.value.filter((v) => v.modelKey != modelKey);
      dragActive.value = null;
    }
  });
});
</script>
<style scoped lang="scss">
.model-base {
  .base-header {
    height: 45px;
    width: 100%;
    background-color: #010c1d;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
    text-align: center;
    font-weight: 500;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 20px;
    box-sizing: border-box;

    .center-box {
      display: flex;
      align-items: center;
      font-size: 22px;
    }
  }

  .base-container {
    display: flex;

    .base-menu {
      height: calc(100vh - 45px);
      width: 230px;
      padding: 10px 10px;
      box-sizing: border-box;
      background-color: #18181c;

      .menu-list {
        li {
          border-radius: 3px;
          font-size: 14px;
          margin-bottom: 10px;
          color: #fff;
          box-sizing: border-box;
          cursor: all-scroll;
          border: 1px solid #323332;

          &:hover {
            border: 2px solid #18c174;
          }

          .model-image {
            font-size: 0;
            padding: 10px 18px;
          }

          .model-info {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 30px;
            padding: 0px 8px;
            box-sizing: border-box;
            background-color: #232324;

            .model-name {
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              text-align: center;
            }
          }
        }
      }
    }

    #drag-content {
      height: calc(100vh - 45px);
      box-sizing: border-box;
      display: flex;
      flex-flow: row;
      width: 100%;
      border: 5px solid #000000;

      .content {
        position: relative;
        overflow: hidden;
        width: 100%;
        background-color: #18181c;
        background-size: 15px 15px, 15px 15px;
        background-image: linear-gradient(#18181c 14px, transparent 0),
          linear-gradient(90deg, transparent 14px, #86909c 0);

        .drag-box {
          .drag-image {
            font-size: 0;
          }
        }
      }
    }
  }
}
</style>
