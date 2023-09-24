<template>
  <div class="edit-box">
    <template v-if="optionDisabled">
      <div class="header">
        <span>几何体模型材质列表</span>
      </div>
      <!-- 材质列表 -->
      <div class="options">
        <el-scrollbar max-height="300px">
          <div
            class="option"
            :class="state.selectMeshUuid == mesh.uuid ? 'option-active' : ''"
            @click="onChangeMaterialType(mesh)"
            v-for="mesh in state.modelMaterialList"
            :key="mesh.uuid"
          >
            <div class="icon-name">
              {{ mesh.name }}
            </div>
            <el-space>
              <div class="check" v-show="state.selectMeshUuid == mesh.uuid">
                <el-icon size="20px" color="#2a3ff6"><Check /></el-icon>
              </div>
              <div class="icon-delete">
                <el-icon size="18px" color="#2a3ff6">
                  <Delete @click.stop="onDeleteGeometry(mesh.uuid)" />
                </el-icon>
              </div>
            </el-space>
          </div>
        </el-scrollbar>
      </div>
      <div class="header">
        <span>几何体模型编辑</span>
      </div>
      <div class="options">
        <div class="option" v-for="key in geometryConfigList" :key="key">
          <div class="grid-txt">
            <el-button type="primary" link>{{ key }} </el-button>
          </div>
          <div class="grid-silder">
            <el-slider
              show-input
              v-if="typeof activeGeometry[key] == 'number'"
              v-model="activeGeometry[key]"
              :min="0.1"
              :max="10"
              :step="0.01"
              @change="onSetGeometry"
            />
            <div v-else-if="typeof activeGeometry[key] == 'string'">
              {{ activeGeometry[key] }}
            </div>
            <el-switch
              @change="onSetGeometry"
              v-else-if="typeof activeGeometry[key] == 'boolean'"
              v-model="activeGeometry[key]"
            />
          </div>
        </div>
      </div>
    </template>
	<el-empty v-else description="当前模型不支持该操作项" :image-size="120" />
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import * as THREE from "three";

const store = useStore();
const { $bus } = getCurrentInstance().proxy;
const config = reactive({
  meaterialName: null,
  color: null,
  wireframe: false,
  depthWrite: true,
  opacity: 1,
});

const activeGeometry = ref(null);
const geometryConfigList = ref([]);

const optionDisabled = computed(() => {
  const geometryList = state.modelMaterialList.filter((v) => v.userData.geometry);
  return geometryList.length ? true : false;
});

const state = reactive({
  modelMaterialList: computed(() => {
    return store.state.modelApi.modelMaterialList;
  }),
  modelApi: computed(() => {
    return store.state.modelApi;
  }),
  selectMeshUuid: computed(() => store.getters.selectMeshUuid),
});

watch(
  () => store.getters.selectMeshUuid,
  (val) => {
    const { geometry, position, material } =
      state.modelMaterialList.find((v) => v.uuid == val) || {};
    if (geometry) {
      const { x, y, z } = position;
      const { type } = geometry;
      const { color } = material;
      activeGeometry.value = {
        type,
        color: new THREE.Color(color).getStyle(),
        x,
        y,
        z,
        ...geometry.parameters,
      };
      geometryConfigList.value = Object.keys(activeGeometry.value);
    } else {
      geometryConfigList.value = [];
    }
  }
);

// 选择材质
const onChangeMaterialType = ({ name, material, geometry }) => {
  config.meaterialName = material.name;
  state.modelApi.onChangeModelMeaterial(name);
};

//修改材质信息
const onSetGeometry = () => {
  state.modelApi.onsetGeometryMesh(activeGeometry.value);
};

// 删除材质
const onDeleteGeometry = (uuid) => {
  state.modelApi.onDeleteGeometryMesh(uuid);
  ElMessage.success("删除成功");
};
</script>
<style scoped lang="scss">
.icon-name {
  width: 240px;
  max-width: 240px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.option {
  justify-content: space-between;
}
.grid-txt {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
</style>
