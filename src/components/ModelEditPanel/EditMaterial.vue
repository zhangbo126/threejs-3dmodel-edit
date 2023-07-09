<template>
  <div class="edit-box">
    <div class="header">
      <span>材质</span>
    </div>
    <!-- 材质列表 -->
    <div class="options">
      <el-scrollbar max-height="250px">
        <div
          class="option"
          :class="state.selectMeshUuid == mesh.uuid? 'option-active' : ''"
          @click="onChangeMaterialType(mesh)"
          v-for="mesh in state.modelMaterialList"
          :key="mesh.uuid"
        >
          <el-space>
            <div class="icon-name">
              {{ mesh.material.name}}
            </div>
            <div class="check" v-show="state.selectMeshUuid== mesh.uuid ">
              <el-icon size="20px" color="#2a3ff6"><Check /></el-icon>
            </div>
          </el-space>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed ,onMounted,getCurrentInstance} from "vue";
import { useStore } from "vuex";
import { PREDEFINE_COLORS } from "@/config/constant";
const store = useStore();
const { $bus } = getCurrentInstance().proxy;
const config = reactive({
  meaterialName: null,
});
const activeMaterial = ref(null)
const state = reactive({
  modelMaterialList: computed(() => {
    return store.state.modelApi.modelMaterialList;
  }),
  modelApi: computed(() => {
    return store.state.modelApi;
  }),
  selectMeshUuid:computed(()=>{
      return store.state.selectMesh.uuid
  })
});

// 选择材质
const onChangeMaterialType = ({ name, id,material }) => {
  // console.log(uuid,material)
  config.meaterialName =material.name;
  // activeMaterial.value = id
  state.modelApi.onChangeModelMeaterial(name)

};
</script>
<style></style>
