<template>
  <div class="h-screen flex flex-col overflow-hidden bg-[#0a0b0e]">
    <!-- 头部区域 -->
    <header class="box-border flex items-center justify-between w-full h-[50px] px-[20px] font-medium text-white bg-[#06070a]/85 border-b border-[#20222e] shadow-[0_4px_20px_0_rgba(0,0,0,0.3)] backdrop-blur-md z-50 shrink-0">
      <div>
        <el-button class="header-btn" type="primary" @click="$router.push({ path: '/' })" icon="DArrowLeft">返回编辑器</el-button>
      </div>
      <div class="flex items-center text-[16px] font-bold tracking-wider bg-gradient-to-r from-[#ffffff] to-[#a5b4fc] bg-clip-text text-transparent">
        <el-space :size="8">
          <el-icon class="text-[#6366f1]">
            <Film />
          </el-icon>
          <span>3D 组件模型库</span>
        </el-space>
      </div>
      <div>
        <el-space>
          <el-button class="header-btn" type="primary" icon="Tickets" @click="onSavaDragData">保存数据</el-button>
        </el-space>
      </div>
    </header>
    <!-- 内容区 -->
    <div class="flex flex-1 overflow-hidden">
      <el-scrollbar class="box-border w-[230px] h-full bg-[#111218] border-r border-[#20222e] shrink-0">
        <div class="p-[12px]">
          <ul>
            <li
              v-for="model in modelBaseList"
              :key="model.fileInfo.id"
              draggable="true"
              @dragstart="e => onDragStart(e, model)"
              @drag="e => onDrag(e)"
              @dragend="onDragEnd"
              class="box-border mb-[12px] text-[13px] text-white cursor-all-scroll border border-[#20222e] rounded-[10px] bg-[#171822]/40 overflow-hidden hover:border-[#6366f1] hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] transition-all duration-300"
            >
              <div class="p-[12px] text-[0] flex items-center justify-center bg-[#111218]/50">
                <el-image draggable="false" fit="scale-down" class="h-[80px] w-full transition-transform duration-300 hover:scale-105" :src="model.fileInfo.icon"></el-image>
              </div>
              <div class="box-border flex items-center justify-center h-[32px] px-[8px] bg-[#171822] border-t border-[#20222e]">
                <div class="overflow-hidden text-center text-ellipsis whitespace-nowrap text-xs text-[#9ca3af] font-medium">
                  <el-tooltip effect="dark" :content="model.fileInfo.name" placement="top">
                    <span>{{ model.fileInfo.name }}</span>
                  </el-tooltip>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </el-scrollbar>
      <div id="drag-content" class="box-border flex-1 h-full">
        <div class="relative w-full h-full overflow-hidden bg-[#0d0e12] bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" @drop="onDrop" @dragover.prevent>
          <draggable-container :adsorb-parent="true" :disabled="true" v-if="dragModelList.length">
            <draggable-resizable-item
              @onDragActive="onDragActive"
              @onDragDeactivated="onDragDeactivated"
              @contextmenu.prevent="onContextmenu"
              v-for="drag in dragModelList"
              :key="drag.modelKey"
              :config="drag"
            ></draggable-resizable-item>
          </draggable-container>
          <div class="flex flex-col items-center justify-center w-full h-full text-[16px] text-[#6366f1] font-semibold tracking-[4px] space-y-2 select-none" v-else>
            <el-icon :size="40" class="animate-bounce text-[#6366f1]/80"><Pointer /></el-icon>
            <span>请从左侧拖拽模型组件到此处进行布局!!!</span>
          </div>
          <!-- 右键菜单 -->
          <right-context-menu :right-menu-position="rightMenuPosition" @onDelete="onDeleteDrag"></right-context-menu>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup name="modelBase">
import { DraggableContainer } from "vue3-draggable-resizable";
import DraggableResizableItem from "@/components/DraggableResizableItem/index.vue";
import RightContextMenu from "@/components/RightContextMenu/index.vue";
import { MODEL_BASE_DATA, MODEL_BASE_DRAGS_DATA } from "@/config/constant";
import { deepCopy, onlyKey } from "@/utils/utilityFunction";
import { ref, getCurrentInstance, onMounted, nextTick } from "vue";
import { ElMessage } from "element-plus";
const { $local } = getCurrentInstance().proxy;
// 左侧模板库数据
const modelBaseList = ref($local.get(MODEL_BASE_DATA));
//可拖拽模型列表
const dragModelList = ref([]);
// 当前选中的内容
const dragActive = ref(null);
const rightMenuPosition = ref({});

// 拖拽开始
const onDragStart = (event, model) => {
  dragActive.value = deepCopy(model);
};
// 拖拽中
const onDrag = event => {
  event.preventDefault();
};
// 拖拽结束
const onDragEnd = event => {
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
  if (dragModelList.value.length >= 4) {
    ElMessage.warning("请注意:模型组件加载过多会导致浏览器崩溃！！！");
  }
};
// 拖拽完成
const onDrop = event => {
  event.preventDefault();
  // 设置模型拖放位置
  const container = document.querySelector("#drag-content").getBoundingClientRect();
  const x = event.clientX - container.left - 520 / 2;
  const y = event.clientY - container.top - 360 / 2;
  dragActive.value.x = x;
  dragActive.value.y = y;
};

// 选中拖拽元素
const onDragActive = drag => {
  dragActive.value = drag;
};
// 取消选中拖拽元素
const onDragDeactivated = modelKey => {
  if (modelKey == dragActive.value.modelKey) {
    dragActive.value = null;
  }
};
// 鼠标右键事件
const onContextmenu = e => {
  rightMenuPosition.value = {
    x: e.clientX,
    y: e.clientY,
    modelKey: dragActive.value.modelKey
  };
  e.preventDefault();
};

// 删除
const onDeleteDrag = modelKey => {
  dragModelList.value = dragModelList.value.filter(v => v.modelKey != modelKey);
};

// 获取拖拽数据列表
const getDragDataList = () => {
  dragModelList.value = $local.get(MODEL_BASE_DRAGS_DATA) || [];
};

// 保存拖拽数据
const onSavaDragData = () => {
  $local.set(MODEL_BASE_DRAGS_DATA, dragModelList.value);
  ElMessage.success("更新成功");
};

// 监听缓存数据变化
onMounted(async () => {
  nextTick(() => {
    getDragDataList();
  });
  // 监听键盘按下 delete 键
  window.addEventListener("keydown", event => {
    if (event.keyCode === 46 && event.key == "Delete" && dragActive.value) {
      const { modelKey } = dragActive.value;
      dragModelList.value = dragModelList.value.filter(v => v.modelKey != modelKey);
      dragActive.value = null;
    }
  });
});
</script>
