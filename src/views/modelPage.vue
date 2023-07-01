<template>
  <div class="model-page">
    <!-- 头部操作栏 -->
    <header class="model-header">
      <div class="lf">基于three.js的3d模型编辑系统</div>
      <div class="title">当前模型:{{ modelName }}</div>
      <div class="lr">
        <a-space>
          <div class="label">
            <a-button type="primary" @click="onChangeModel">选择模型</a-button>
          </div>
          <div class="label">
            <a-button type="primary">导出模型</a-button>
          </div>
        </a-space>
      </div>
    </header>
    <div id="model"></div>
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
const modelName = ref('默认模型');
const onChangeModel = () => {
  select.value.showModal();
};
//选择模型成功
const onChangeSuccess = (model) => {
  modelName.value = model.name;
  state.modelApi.onSwitchModel(model);
};
onMounted(() => {
  store.commit("SET_MODEL_API", new renderModel("#model"));
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
  #model {
    width: 100%;
    height: calc(100vh - 45px);
  }
}
</style>
