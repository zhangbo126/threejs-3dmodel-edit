<template>
  <div>
    <!-- 头部区域 -->
    <header class="box-border flex items-center justify-between w-full h-[45px] px-[20px] font-medium text-white text-center bg-[#010c1d] shadow-[0_2px_8px_0_rgba(0,0,0,0.1)]">
      <div>
        <el-button type="primary" @click="$router.push({ path: '/' })" icon="DArrowLeft">返回编辑器</el-button>
      </div>
      <div class="flex items-center text-[22px]">
        <el-space>
          <el-icon>
            <Film />
          </el-icon>
          <p>3D组件模型库</p>
        </el-space>
      </div>
      <div>
        <el-space>
          <el-button type="primary" icon="Tickets" @click="onSavaDragData">保存数据</el-button>
        </el-space>
      </div>
    </header>
    <!-- 内容区 -->
    <div class="flex">
      <el-scrollbar :max-height="'calc(100vh - 45px)'" class="box-border w-[230px] h-[calc(100vh-45px)] p-[10px] bg-[#18181c]">
        <ul>
          <li
            v-for="model in modelBaseList"
            :key="model.fileInfo.id"
            draggable="true"
            @dragstart="e => onDragStart(e, model)"
            @drag="e => onDrag(e)"
            @dragend="onDragEnd"
            class="box-border mb-[10px] text-[14px] text-white cursor-all-scroll border border-[#323332] rounded-[3px] hover:border-[2px] hover:border-[#18c174]"
          >
            <div class="p-[10px_18px] text-[0]">
              <el-image draggable="false" fit="scale-down" :src="model.fileInfo.icon"></el-image>
            </div>
            <div class="box-border flex items-center justify-center h-[30px] px-[8px] bg-[#232324]">
              <div class="overflow-hidden text-center text-ellipsis whitespace-nowrap">
                <el-tooltip effect="dark" :content="model.fileInfo.name" placement="top">
                  <span>{{ model.fileInfo.name }}</span>
                </el-tooltip>
              </div>
            </div>
          </li>
        </ul>
      </el-scrollbar>
      <div id="drag-content" class="box-border flex w-full h-[calc(100vh-45px)] border-[5px] border-black">
        <div class="relative w-full overflow-hidden bg-[#18181c] bg-[linear-gradient(#18181c_14px,transparent_0),linear-gradient(90deg,transparent_14px,#86909c_0)] bg-[size:15px_15px,15px_15px]" @drop="onDrop" @dragover.prevent>
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
          <div class="flex items-center justify-center w-full h-full text-[20px] text-[#18c174] tracking-[10px]" v-else>请拖拽添加多个!!!</div>
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
