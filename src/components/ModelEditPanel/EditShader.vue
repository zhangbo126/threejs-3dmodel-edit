<template>
  <div class="h-[calc(100vh-90px)]">
    <div
      class="box-border flex items-center justify-between w-full h-[35px] px-[20px] text-[#cccccc] bg-[#33343f] border-t border-b border-[#1b1c23]"
    >
      <span>着色器列表 </span>
    </div>
    <div class="box-border max-w-[380px] bg-[#1b1c23]">
      <div class="flex flex-wrap gap-[10px] p-[10px]">
        <div
          class="text-[12px] w-[82px] h-[40px] leading-[40px] flex items-center justify-center cursor-move text-white p-[10px] bg-[#2a2f45] rounded-[6px] shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
          :draggable="true"
          v-for="item in shaderDragList"
          :key="item.id"
          @dragstart="() => onDragStart(item)"
          @drag="event => event.preventDefault()"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div
      class="box-border flex items-center justify-between w-full h-[35px] px-[20px] text-[#cccccc] bg-[#33343f] border-t border-b border-[#1b1c23]"
    >
      <span> 场景着色器 </span>
    </div>
    <div class="box-border max-w-[380px] bg-[#1b1c23]">
      <div class="flex-wrap gap-[10px]" v-if="shaderList.length > 0">
        <div
          class="text-[12px] text-white h-[30px] px-[10px] text-center flex justify-between items-center cursor-pointer"
          :class="{ 'bg-[#27282f]': currentShaderUuid === item.onlyUuid }"
          @click="changeCurrentShader(item)"
          v-for="item in shaderList"
          :key="item.id"
        >
          <span> {{ item.name }}</span>
          <el-icon :size="16" @click.stop="deleteShader(item)">
            <Delete />
          </el-icon>
        </div>
      </div>
      <el-empty description="暂无场景着色器" v-else />
    </div>
    <div
      class="box-border flex items-center justify-between w-full h-[35px] px-[20px] text-[#cccccc] bg-[#33343f] border-t border-b border-[#1b1c23]"
    >
      <span> 着色器编辑 </span>
    </div>
    <div class="box-border max-w-[380px] bg-[#1b1c23]" v-if="currentShaderUuid">
      <div class="flex flex-col gap-[10px] border-t border-[#2a2f45] p-[8px]">
        <div class="flex items-center">
          <div class="min-w-[50px] text-white text-[12px]">位置</div>
          <el-space>
            <el-input-number class="!w-[100px]" v-model="currentShaderInfo.position.x" :controls="false" :precision="2" />
            <el-input-number class="!w-[100px]" v-model="currentShaderInfo.position.y" :controls="false" :precision="2" />
            <el-input-number class="!w-[100px]" v-model="currentShaderInfo.position.z" :controls="false" :precision="2" />
          </el-space>
        </div>
        <div class="flex items-center">
          <div class="min-w-[50px] text-white text-[12px]">旋转</div>
          <el-space>
            <el-input-number class="!w-[100px]" v-model="currentShaderInfo.rotation.x" :controls="false" :precision="2" />
            <el-input-number class="!w-[100px]" v-model="currentShaderInfo.rotation.y" :controls="false" :precision="2" />
            <el-input-number class="!w-[100px]" v-model="currentShaderInfo.rotation.z" :controls="false" :precision="2" />
          </el-space>
        </div>
        <div class="flex items-center">
          <div class="min-w-[50px] text-white text-[12px]">缩放</div>
          <el-space>
            <el-input-number class="!w-[100px]" v-model="currentShaderInfo.scale.x" :controls="false" :precision="2" />
            <el-input-number class="!w-[100px]" v-model="currentShaderInfo.scale.y" :controls="false" :precision="2" />
            <el-input-number class="!w-[100px]" v-model="currentShaderInfo.scale.z" :controls="false" :precision="2" />
          </el-space>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { shaderConfigList } from "@/config/model";
import { useMeshEditStore } from "@/store/meshEditStore";
import { getShaderMaterials } from "@/utils/utilityFunction";
import { MODEL_TYPE_ENUM } from "@/config/constant";

const store = useMeshEditStore();
// 拖拽着色器列表
const shaderDragList = ref(shaderConfigList);

// 着色器列表
const shaderList = computed(() => {
  return getShaderMaterials(store.modelApi?.scene);
});

const currentShaderInfo = reactive({
  position: {
    x: 0,
    y: 0,
    z: 0
  },
  rotation: {
    x: 0,
    y: 0,
    z: 0
  },
  scale: {
    x: 1,
    y: 1,
    z: 1
  }
});
// 拖拽开始
const onDragStart = item => {
  store.modelApi.shaderModules.setDragShader(item);
  store.setActiveEditModelType(MODEL_TYPE_ENUM.Shader);
};

// 当前选中着色器
const currentShaderUuid = ref(null);
const changeCurrentShader = item => {
  currentShaderUuid.value = item.onlyUuid;
  const mesh = store.modelApi.scene.getObjectByProperty("uuid", item.uuid);
  if (mesh) {
    Object.assign(currentShaderInfo, {
      position: mesh.position,
      rotation: mesh.rotation,
      scale: mesh.scale
    });
  }
};

// 删除着色器
const deleteShader = item => {
  store.modelApi.shaderModules.deleteShader(item.onlyUuid);
};
</script>
