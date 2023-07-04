<template>
  <div class="model-page">
    <!-- 头部操作栏 -->
    <header class="model-header">
      <div class="lf">基于three.js的3d模型可视化编辑系统</div>
      <div class="title">当前模型:{{ modelName }}</div>
      <div class="lr">
        <el-space>
          <div class="label">
            <el-button type="primary" @click="onChangeModel">选择模型</el-button>
          </div>
          <div class="label">
            <el-button type="primary">导出模型</el-button>
          </div>
        </el-space>
      </div>
    </header>
    <div class="model-container"  v-loading="loading">
      <div id="model"></div>
      <div class="model-panel">
        <model-edit-panel v-if="!loading"></model-edit-panel>
      </div>
    </div>
    <!-- 模型选择弹框 -->
    <model-select-dialog
      ref="select"
      @onChangeSuccess="onChangeSuccess"
    ></model-select-dialog>
  </div>
</template>

<script setup>
import { ModelEditPanel, ModelSelectDialog } from "@/components/index";
import { onMounted, ref, reactive, computed } from "vue";
import { useStore } from "vuex";
import renderModel from "./renderModel";
const store = useStore();
const state = reactive({
  modelApi: computed(() => {
    return store.state.modelApi;
  }),
});
const select = ref(null);
const loading = ref(false);
const modelName = ref("默认模型");
const onChangeModel = () => {
  select.value.showDialog();
};
//选择模型成功
const onChangeSuccess = async (model) => {
  modelName.value = model.name;
  loading.value = true;
  try {
    const success = await state.modelApi.onSwitchModel(model);
    if (success) {
      loading.value = false;
    }
  } catch (err) {
    loading.value = false;
  }
};
onMounted(async () => {
  loading.value = true;
  const modelApi = new renderModel("#model");
  store.commit("SET_MODEL_API", modelApi);
  const load = await modelApi.init();
  if (load) {
    loading.value = false;
  }
});
</script>

<style lang="less" scoped>
.model-page {
   width: 100%;
  .model-header {
    height: 45px;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0px 10px;
    .lr {
      display: flex;
    }
  }
  .model-container {
    display: flex;
  }
  #model {
    width:calc(100% - 350px);
    height: calc(100vh - 45px);
  }
}
</style>
