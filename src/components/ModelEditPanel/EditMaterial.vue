<template>
  <div class="edit-box" v-zLoading="loading">
    <div class="header">
      <span>材质类型</span>
      <el-button type="primary" icon="Refresh" @click="onInitialize"> 重置 </el-button>
    </div>
    <div class="options">
      <div class="option">
        <el-space>
          <span>当前材质类型：</span>
          <el-select
            v-model="activeMeshType"
            @change="onChangeMeshType"
            placeholder="请选择"
            size="small"
            :style="{ width: '200px' }"
          >
            <el-option
              v-for="item in meshTypeList"
              :key="item.type"
              :label="`${item.type ? item.type : ''}(${item.describe})`"
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
          @click.stop="onChangeMaterialType(mesh)"
          v-for="mesh in state.modelMaterialList"
          :key="mesh.uuid"
        >
          <el-space>
            <el-icon @click="onSetMeshVisible(mesh)" size="18" color="#409eff" v-if="mesh.visible">
              <View />
            </el-icon>
            <el-icon size="18" @click="onSetMeshVisible(mesh)" v-else>
              <Hide />
            </el-icon>
            <div class="icon-name">
              {{ mesh.name }}
            </div>
            <div class="check" v-show="state.selectMeshUuid == mesh.uuid">
              <el-icon size="20px" color="#2a3ff6">
                <Check />
              </el-icon>
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
          <el-color-picker color-format="rgb" :predefine="PREDEFINE_COLORS" @change="onChangeMaterial" v-model="config.color" />
        </el-space>
        <el-space>
          <el-tooltip effect="dark" content="注意：深度写入属性不支持模型“导出” " placement="top">
            <el-icon>
              <WarnTriangleFilled :size="20" color="#ffb940" />
            </el-icon>
          </el-tooltip>
          <el-button type="primary" link>深度写入</el-button>
          <el-switch @change="onChangeMaterial" v-model="config.depthWrite"></el-switch>
        </el-space>
        <el-space>
          <el-tooltip effect="dark" content="注意：网格属性不支持模型“导出” " placement="top">
            <el-icon>
              <WarnTriangleFilled :size="20" color="#ffb940" />
            </el-icon>
          </el-tooltip>
          <el-button type="primary" link>网格</el-button>
          <el-switch @change="onChangeMaterial" v-model="config.wireframe"></el-switch>
        </el-space>
      </div>
      <div class="option">
        <div class="grid-txt">
          <el-button type="primary" link>透明度 </el-button>
        </div>
        <div class="grid-sidle">
          <el-slider
            show-input
            @input="onChangeMaterial"
            @change="onChangeMaterial"
            v-model="config.opacity"
            :min="0"
            :max="1"
            :step="0.01"
          />
        </div>
      </div>
    </div>
    <div class="header">当前材质自带贴图</div>
    <div class="options">
      <el-scrollbar max-height="140px">
        <el-row justify="center" align="middle" :style="{ minHeight: '120px' }">
          <el-col :span="10" :offse="4" :style="{ textAlign: 'center' }" v-if="activeMeshMap">
            <div
              @click="onChangeModelMap(activeMeshMap)"
              :class="activeMapId == activeMeshMap.mapId ? 'active' : ''"
              class="mesh-image"
            >
              <el-image :src="activeMeshMap.url" class="mesh-map" fit="cover"> </el-image>
              <div class="select" v-if="activeMapId == activeMeshMap.mapId">
                <el-icon color="#18c174" :size="26"><Select /></el-icon>
              </div>
            </div>
          </el-col>
          <el-col :span="8" :style="{ textAlign: 'center' }" v-if="activeMeshMap">
            <el-upload
              action=""
              accept=".jpg,.png,.hdr"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="onUploadTexture"
            >
              <el-tooltip effect="dark" content="该功能仅仅作预览，数据无法保存 " placement="top">
                <el-button type="primary" icon="UploadFilled">加载外部贴图</el-button>
              </el-tooltip>
            </el-upload>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
    <div class="header">系统贴图</div>
    <div class="options" :class="optionDisabled">
      <el-scrollbar max-height="230px">
        <el-row>
          <el-col :span="6" :style="{ textAlign: 'center' }" v-for="map in mapImageList" :key="map.id">
            <div @click="onChangeSystemModelMap(map)" class="image-box" :class="activeMapId == map.id ? 'active' : ''">
              <el-image :src="map.url" class="el-map" fit="cover" />
              <div class="select" v-if="activeMapId == map.id">
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
import { useMeshEditStore } from "@/store/meshEditStore";
import { PREDEFINE_COLORS, meshTypeList } from "@/config/constant";
import { getFileType } from "@/utils/utilityFunction";
import { mapImageList } from "@/config/model";
import * as THREE from "three";
import { ElMessage } from "element-plus";

const store = useMeshEditStore();
const { $bus } = getCurrentInstance().proxy;
const config = reactive({
  meshName: null,
  color: null,
  wireframe: false,
  depthWrite: true,
  opacity: 1
});
const loading = ref(false);
const activeMeshType = ref("");
const activeMeshMap = ref(null);
const activeMapId = ref(null);

const optionDisabled = computed(() => {
  const activeMesh = state.modelMaterialList.find(v => v.uuid == state.selectMeshUuid) || {};
  return activeMesh.uuid ? "" : "disabled";
});

const state = reactive({
  modelMaterialList: computed(() => store.modelApi.modelMaterialList),
  originalMaterials: computed(() => store.modelApi.originalMaterials),
  modelApi: computed(() => store.modelApi),
  selectMeshUuid: computed(() => store.selectMeshUuid)
});

onMounted(() => {
  $bus.on("update-model", () => {
    // 重置动画数据
    Object.assign(config, {
      color: null,
      wireframe: false,
      depthWrite: true,
      opacity: 1
    });
  });
});

watch(
  () => store.selectMeshUuid,
  val => {
    const mesh = state.modelMaterialList.find(v => v.uuid == val) || {};
    activeMapId.value = mesh.mapId;
    if (mesh.mapId) {
      const { color, wireframe, depthWrite, opacity } = mesh.material;
      const newColor = new THREE.Color(color).getStyle();
      Object.assign(config, {
        color: newColor,
        wireframe,
        depthWrite,
        opacity
      });

      const originMaterial = state.originalMaterials.get(mesh.uuid);
      activeMeshMap.value = {
        url: getModelMaps(mesh),
        name: mesh.name,
        mapId: originMaterial.userData.mapId,
        material: mesh.material
      };
    } else {
      activeMeshMap.value = null;
    }
  }
);

// 切换材质类型
const onChangeMeshType = e => {
  const activeMesh = meshTypeList.find(v => v.type == e);
  state.modelApi.onChangeModelMeshType(activeMesh);
};

// 选择材质
const onChangeMaterialType = mesh => {
  const { name } = mesh;
  config.meshName = name;
  const activeMesh = state.modelApi.onChangeModelMaterial(name);
  const { color, wireframe, depthWrite, opacity } = activeMesh.material;
  Object.assign(config, {
    color: new THREE.Color(color).getStyle(),
    wireframe,
    depthWrite,
    opacity
  });

  const originMaterial = state.originalMaterials.get(mesh.uuid);
  activeMeshMap.value = {
    url: getModelMaps(mesh),
    name: mesh.name,
    mapId: mesh.mapId,
    material: originMaterial
  };
};

// 获取模型自带贴图
const getModelMaps = mesh => {
  const originMaterial = state.originalMaterials.get(mesh.uuid);
  const materials = Array.isArray(originMaterial) ? originMaterial : [originMaterial];
  let textureMapUrl;
  materials.forEach(texture => {
    if (texture.map && texture.map.image) {
      const canvas = document.createElement("canvas");
      const { width, height } = texture.map.image;
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      context.drawImage(texture.map.image, 0, 0);
      textureMapUrl = canvas.toDataURL("image/png", 0.5);
      canvas.remove();
    }
  });
  return textureMapUrl;
};

const onChangeMaterial = () => {
  state.modelApi.onSetModelMaterial(config);
};

// 设置材质显隐
const onSetMeshVisible = mesh => {
  mesh.visible = !mesh.visible;
  state.modelApi.onSetMeshVisible(mesh);
};

//修改当前材质贴图
const onChangeModelMap = map => {
  activeMapId.value = map.mapId;
  state.modelApi.onSetModelMap(map);
  ElMessage.success("当前材质贴图修改成功");
};
// 修改当前材质贴图
const onChangeSystemModelMap = async map => {
  try {
    loading.value = true;
    activeMapId.value = map.id;
    // 修改当前材质列表的贴图ID
    const mesh = state.modelMaterialList.find(v => v.uuid == store.selectMeshUuid) || {};
    mesh.mapId = map.id;
    state.modelApi.onSetSystemModelMap(map);
    ElMessage.success("当前材质贴图修改成功");
  } finally {
    loading.value = false;
  }
};

// 上传外部贴图
const onUploadTexture = async file => {
  const filePath = URL.createObjectURL(file.raw);
  await state.modelApi.onSetStorageModelMap(filePath, getFileType(file.name));
  URL.revokeObjectURL(filePath);
  ElMessage.success("当前材质贴图修改成功");
};

// 重置数据
const onInitialize = () => {
  Object.assign(config, {
    meshName: null,
    color: "#fff",
    wireframe: false,
    depthWrite: true,
    opacity: 1
  });
  activeMeshType.value = "";
  activeMapId.value = null;
  state.modelApi.initModelMaterial();
};

const getMeshConfig = () => {
  return {
    materialType: activeMeshType.value,
    meshList: state.modelApi.onGetEditMeshList()
  };
};
defineExpose({
  getMeshConfig
});
</script>
<style scoped lang="scss">
.options {
  max-width: 380px;
}
.image-box {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 90px;
  cursor: pointer;
  opacity: 0.6;
  .el-map {
    max-height: 70px;
    padding: 6px;
  }
}
.select {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: auto;
}
.not-load {
  padding: 20px 0;
  font-size: 16px;
  color: #ffffff;
  text-align: center;
}
.mesh-image {
  position: relative;
  box-sizing: border-box;
  max-width: 140px;
  font-size: 0;
  cursor: pointer;
  opacity: 0.6;
  .mesh-map {
    position: relative;
    height: 100px;
    max-height: 100px;
    margin: 8px 9px;
  }
}
.active {
  border: 2px solid #18c174;
  opacity: 1;
}
</style>
