<template>
  <div class="edit-box">
    <template v-if="disabled">
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
                <el-icon size="20px" color="#2a3ff6">
                  <Check />
                </el-icon>
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
              :min="inputRange(key).min"
              :max="inputRange(key).max"
              :step="inputRange(key).step"
              @input="onSetGeometry"
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
    <el-empty v-else description="当前模型不支持使用该功能" :image-size="120" />
  </div>
</template>
<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useMeshEditStore } from "@/store/meshEditStore";
import { ElMessage } from "element-plus";

const store = useMeshEditStore();
const config = reactive({
  materialName: null,
  type: null
});

const activeGeometry = ref(null);
const geometryConfigList = ref([]);

const disabled = computed(() => {
  const geometrylen = state.modelMaterialList.filter(v => v.userData.geometry);
  return geometrylen == 0 ? false : true;
});

const state = reactive({
  modelMaterialList: computed(() => store.modelApi.modelMaterialList),
  selectMeshUuid: computed(() => store.selectMeshUuid)
});
watch(
  () => store.selectMeshUuid,
  val => {
    const { geometry } = state.modelMaterialList.find(v => v.uuid == val) || {};
    if (geometry) {
      const { type } = geometry;
      activeGeometry.value = {
        ...geometry.parameters
      };
      config.type = type;
      geometryConfigList.value = Object.keys(activeGeometry.value);
    } else {
      geometryConfigList.value = [];
    }
  }
);

// 选择材质
const onChangeMaterialType = ({ name, material, geometry }) => {
  config.materialName = material.name;
  store.modelApi.onChangeModelMaterial(name);
};

//修改材质信息
const onSetGeometry = () => {
  store.modelApi.onSetGeometryMesh(activeGeometry.value, config.type);
};

// 删除材质
const onDeleteGeometry = uuid => {
  store.modelApi.onDeleteGeometryMesh(uuid);
  store.selectMeshAction({});
  ElMessage.success("删除成功");
};

const inputRange = key => {
  let range = {
    min: 1,
    max: 80,
    step: 0.01
  };
  if (
    [
      "width",
      "height",
      "radius",
      "length",
      "thetaLength",
      "radiusTop",
      "innerRadius",
      "radiusBottom",
      "q",
      "outerRadius",
      "arc",
      "tube",
      "p"
    ].includes(key)
  ) {
    range = {
      min: 0.1,
      max: 10,
      step: 0.01
    };
  }
  if (
    ["detail", "capSegments", "radialSegments", "thetaStart", "depthSegments", "widthSegments", "heightSegments"].includes(key)
  ) {
    range = {
      min: 0,
      max: 10,
      step: 1
    };
  }
  return range;
};
</script>
<style scoped lang="scss">
.icon-name {
  width: 240px;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
