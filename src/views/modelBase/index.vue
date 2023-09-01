<template>
  <div class="model-base">
    <!-- 头部区域 -->
    <header class="base-header">
      <div class="lf-box"></div>
      <div class="center-box">
        <el-space>
          <el-icon>
            <ElementPlus />
          </el-icon>
          <p>3d模型库</p>
        </el-space>
      </div>
      <div class="lr-box"></div>
    </header>
    <!-- 内容区 -->
    <div class="base-container">
      <el-scrollbar :max-height="'calc(100vh - 45px)'" class="base-menu">
        <ul class="menu-list">
          <li v-for="model in modelBaseList" :key="model.fileInfo.id" draggable="true"
            @dragstart="(e) => onDragStart(e, model)" @drag="(e) => onDrag(e)">
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
      <div class="drag-content">
        <div class="content" @drop="onDrop" @dragover.prevent>
          <draggable-container :adsorbParent="true" :disabled="true">
            <draggable-resizable-item v-for="drag in dragModelList" :config="drag"></draggable-resizable-item>
          </draggable-container>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { DraggableContainer } from "vue3-draggable-resizable";
import DraggableResizableItem from '@/components/DraggableResizableItem/index'
import { MODEL_BASE_DATA, MODEL_DEFAULT_CONFIG } from "@/config/constant";
import { modelList } from "@/config/model";
import { ref, getCurrentInstance, onMounted, nextTick } from "vue";
const { $local, $bus } = getCurrentInstance().proxy;
const modelBaseList = ref([])
const dragModelList = ref([]);
const dragActive = ref(null)
// 拖拽开始
const onDragStart = (event, model) => {
  dragActive.value = model
};
// 拖拽中
const onDrag = (event) => {
  event.preventDefault();
};
// 拖拽完成
const onDrop = (event) => {
  
  // const partent = event.target.getBoundingClientRect()
  // console.log(partent)
  event.preventDefault();
  dragActive.value.width = 600
  dragActive.value.height = 400
  dragModelList.value.push(dragActive.value)
    nextTick(() => {
       const {left} =  event.target.firstElementChild.getBoundingClientRect()
       const leftMenu  =  document.querySelector('.base-menu').clientWidth
       const x =  left -leftMenu
      //  console.log(x)
  });
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
        fileInfo: { ...v }
      });
    });
    $local.set(MODEL_BASE_DATA, modelBaseData);
  }
  modelBaseList.value = $local.get(MODEL_BASE_DATA)

};
// 监听缓存数据变化
onMounted(async () => {
  nextTick(() => {
    initModelBaseData();
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

    .drag-content {
      height: calc(100vh - 45px);
      box-sizing: border-box;
      display: flex;
      flex-flow: row;
      width: 100%;
      border: 5px solid #000000;

      .content {
        position: relative;
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
