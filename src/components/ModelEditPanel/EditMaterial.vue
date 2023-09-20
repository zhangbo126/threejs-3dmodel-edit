<template>
  <div class="edit-box">
    <div class="header">
      <span>材质类型</span>
    </div>
    <div class="options">
       <div class="option">
        <el-space>
        <span>当前材质类型：</span>
          <el-select  v-model="activeMeshType" @change="onChangeMeshType"  placeholder="请选择" size="small">
            <el-option
              v-for="item in meshTypeList"
              :key="item.type"
              :label="`${item.type}(${item.describe})`"
              :value="item.type"
            />
          </el-select>
        </el-space>
       </div>
    </div>
    <div class="header">
      <span>材质</span>
    </div>
    <!-- 材质列表 -->
    <div class="options">
      <el-scrollbar max-height="200px">
        <div
          class="option"
          :class="state.selectMeshUuid == mesh.uuid ? 'option-active' : ''"
          @click="onChangeMaterialType(mesh)"
          v-for="mesh in state.modelMaterialList"
          :key="mesh.uuid"
        >
          <el-space>
            <el-icon @click="onSetMeshVisibe(mesh)" size="18" color="#409eff" v-if="mesh.visible"><View /></el-icon>
            <el-icon size="18" @click="onSetMeshVisibe(mesh)" v-else><Hide /></el-icon>
            <div class="icon-name">
              {{ mesh.name }}
            </div>
            <div class="check" v-show="state.selectMeshUuid == mesh.uuid">
              <el-icon size="20px" color="#2a3ff6"><Check /></el-icon>
            </div>
          </el-space>
        </div>
      </el-scrollbar>
    </div>
    <!-- 材质属性 -->
    <div class="header">材质属性</div>
    <div class="options" :class="optionDisabled">
      <div class="option space-between">
        <el-space>

          <el-button type="primary" link>材质颜色</el-button>
          <el-color-picker
            color-format="hex"
            :predefine="PREDEFINE_COLORS"
            @change="onChangeMeaterial"
            @active-change="activeChangeColor"
            v-model="config.color"
          />
        </el-space>
        <el-space>
          <el-button type="primary" link>深度写入</el-button>
          <el-switch @change="onChangeMeaterial" v-model="config.depthWrite"></el-switch>
        </el-space>
        <el-space>
          <el-tooltip
          effect="dark"
          content="注意：设置了模型材质网格属性为true时在模型导出时会造成材质损坏"
          placement="top"
        >
          <el-icon>
            <WarnTriangleFilled :size="20" color="#ffb940" />
          </el-icon>
        </el-tooltip>
          <el-button type="primary" link>网格</el-button>
          <el-switch @change="onChangeMeaterial" v-model="config.wireframe"></el-switch>
        </el-space>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>透明度 </el-button>
        </div>
        <div class="grid-silder">
          <el-slider
            show-input
            @change="onChangeMeaterial"
            v-model="config.opacity"
            :min="0"
            :max="1"
            :step="0.01"
          />
        </div>
      </div>
    </div>
    <div class="header">模型自带贴图</div>
    <div class="options" :class="optionDisabled">
      <el-scrollbar max-height="100px">
        <el-row>
          <el-col
            :span="6"
            :style="{ textAlign: 'center' }"
            v-for="map in state.modelTextureMap"
            :key="map.mapId"
          >
            <div
              @click="onChangeModelMap(map)"
              class="image-box"
              :class="activeTextureMap == map.mapId ? 'active' : ''"
            >
              <el-image :src="map.url" class="el-map" fit="cover" />
              <div class="select" v-if="activeTextureMap == map.mapId">
                <el-icon color="#18c174" :size="26"><Select /></el-icon>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
    <div class="header">系统贴图</div>
    <div class="options" :class="optionDisabled">
      <el-scrollbar max-height="230px">
        <el-row>
          <el-col
            :span="6"
            :style="{ textAlign: 'center' }"
            v-for="map in mapImageList"
            :key="map.id"
          >
            <div
              @click="onChangeSystemModelMap(map)"
              class="image-box"
              :class="activeTextureMap == map.id ? 'active' : ''"
            >
              <el-image :src="map.url" class="el-map" fit="cover" />
              <div class="select" v-if="activeTextureMap == map.id">
                <el-icon color="#18c174" :size="26"><Select /></el-icon>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, watch } from "vue";
import { useStore } from "vuex";
import { PREDEFINE_COLORS ,meshTypeList} from "@/config/constant";
import { mapImageList } from "@/config/model";
import * as THREE from "three";
import { ElMessage } from "element-plus";

const store = useStore();
const { $bus } = getCurrentInstance().proxy;
const config = reactive({
  meaterialName: null,
  color: null,
  wireframe: false,
  depthWrite: true,
  opacity: 1,
});
const activeMeshType =ref('MeshStandardMaterial')
const activeMesh = reactive({
    type: 'MeshStandardMaterial',
    describe:'标准网格材质',
		color: true,
		wireframe: true,
		depthWrite: true,
		opacity: true,
})
const activeTextureMap = ref(null);

const optionDisabled = computed(() => {
  const activeMesh =
    state.modelMaterialList.find((v) => v.uuid == state.selectMeshUuid) || {};
  return activeMesh.uuid ? "" : "disabled";
});

const state = reactive({
  modelMaterialList: computed(() => {
    return store.state.modelApi.modelMaterialList;
  }),
  modelApi: computed(() => {
    return store.state.modelApi;
  }),
  selectMeshUuid: computed(() => store.getters.selectMeshUuid),
  modelTextureMap: computed(() => {
    return store.state.modelApi.modelTextureMap;
  }),
});
onMounted(() => {
  $bus.on("model-update", () => {
    // 重置动画数据
    Object.assign(config, {
      color: null,
      wireframe: false,
      depthWrite: true,
      opacity: 1,
    });
  });
});

watch(
  () => store.getters.selectMeshUuid,
  (val) => {
    const map = state.modelMaterialList.find((v) => v.uuid == val) || {};
    activeTextureMap.value = map.mapId;
    if (map.mapId) {
      const { color, wireframe, depthWrite, opacity } = map.material;
      Object.assign(config, {
        color: new THREE.Color(color).getStyle(),
        wireframe,
        depthWrite,
        opacity,
      });
    }
  }
);

// 切换材质类型
const onChangeMeshType =(e) =>{
  const activeMesh =  meshTypeList.find(v=>v.type==e)
  state.modelApi.onChangeModelMeshType(activeMesh);
}

// 选择材质
const onChangeMaterialType = ({ name, id, material, mapId }) => {
  config.meaterialName = material.name;
  const activeMesh = state.modelApi.onChangeModelMeaterial(name);
  const { color, wireframe, depthWrite, opacity } = activeMesh.material;
  Object.assign(config, {
    color: new THREE.Color(color).getStyle(),
    wireframe,
    depthWrite,
    opacity,
  });
};

const activeChangeColor = (color) => {
  config.color = color;
  state.modelApi.onSetModelMaterial(config);
};

const onChangeMeaterial = () => {
  state.modelApi.onSetModelMaterial(config);
};

// 设置材质显隐
const onSetMeshVisibe=(mesh)=>{
    mesh.visible = !mesh.visible
}
//修改当前材质贴图
const onChangeModelMap = (map) => {
  activeTextureMap.value = map.mapId;
  state.modelApi.onSetModelMap(map);
  Object.assign(config, {
    color: null,
    wireframe: false,
    depthWrite: true,
    opacity: 1,
  });
  ElMessage.success("当前材质贴图修改成功");
};
// 修改当前材质贴图
const onChangeSystemModelMap = (map) => {
  activeTextureMap.value = map.id;
  state.modelApi.onSetSystemModelMap(map);
  Object.assign(config, {
    color: null,
    wireframe: false,
    depthWrite: true,
    opacity: 1,
  });
  ElMessage.success("当前材质贴图修改成功");
};
const getMeshConfig = () => {
  return {
    meshList: state.modelApi.onGetEditMeshList(),
  };
};
defineExpose({
  getMeshConfig,
});
</script>
<style scoped lang="scss">
.grid-txt {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.options {
  max-width: 380px;
}
.image-box {
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer;
  opacity: 0.6;
  position: relative;
  .el-map {
    padding: 6px;
  }
  .select {
    position: absolute;
  }
}

.active {
  border: 2px solid #18c174;
  opacity: 1;
}
</style>
