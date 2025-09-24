<template>
  <div class="edit-box">
    <div class="header">
      <span>着色器列表 </span>
    </div>
    <div class="options">
      <div class="shader-drag-list">
        <div
          class="shader-item"
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
    <div class="header">
      <span> 场景着色器 </span>
    </div>
    <div class="options">
      <div class="shader-list">
        <div
          class="shader-item"
          :class="{ 'option-active': currentShaderUuid === item.onlyUuid }"
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
    </div>
    <div class="header">
      <span> 着色器编辑 </span>
    </div>
    <div class="options" v-if="currentShaderUuid">
      <div class="shader-info">
        <div class="shader-info-item">
          <div class="label">位置</div>
          <el-space>
            <el-input-number v-model="currentShaderInfo.position.x" :controls="true" />
            <el-input-number v-model="currentShaderInfo.position.y" :controls="true" />
            <el-input-number v-model="currentShaderInfo.position.z" :controls="true" />
          </el-space>
        </div>
        <div class="shader-info-item">
          <div class="label">旋转</div>
          <el-space>
            <el-input-number v-model="currentShaderInfo.rotation.x" :controls="true" />
            <el-input-number v-model="currentShaderInfo.rotation.y" :controls="true" />
            <el-input-number v-model="currentShaderInfo.rotation.z" :controls="true" />
          </el-space>
        </div>
        <div class="shader-info-item">
          <div class="label">缩放</div>
          <el-space>
            <el-input-number v-model="currentShaderInfo.scale.x" :controls="true" />
            <el-input-number v-model="currentShaderInfo.scale.y" :controls="false" />
            <el-input-number v-model="currentShaderInfo.scale.z" :controls="true" />
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
  store.setActiveEditModelType("shader");
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
  store.modelApi.shaderModules.deleteShader(item.uuid);
};
</script>

<style scoped lang="scss">
.shader-drag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  .shader-item {
    font-size: 12px;
    width: 60px;
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: move;
    color: #fff;
    padding: 10px;
    background-color: #2a2f45;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 20%);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
}
.shader-list {
  flex-wrap: wrap;
  gap: 10px;
  .shader-item {
    font-size: 12px;
    color: #fff;
    height: 30px;
    padding: 0px 10px;
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }
}
.shader-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid #2a2f45;
  padding: 8px;
  .shader-info-item {
    display: flex;
    align-items: center;
    .label {
      width: 50px;
      color: #fff;
      font-size: 12px;
    }
  }
}
</style>
