<template>
  <a-modal
    v-model:visible="visible"
    :destroyOnClose="true"
    :maskClosable="false"
    keyboard
    width="750px"
    title="请选择模型"
    @ok="onHandleOk"
    @cancel="onCancelModal"
  >
    <ul class="model-list">
      <li
        v-for="model in modelList"
        :class="model.id == activeId ? 'active' : ''"
        :key="model.id"
        @click="activeId = model.id"
      >
        <div class="model-icon">
          <a-image
            :preview="false"
            :src="model.icon"
            :width="100"
            :height="100"
            :fallback="IMAGE_ERROR"
          ></a-image>
        </div>
        <div class="model-name">
          <span>{{ model.name }}</span>
        </div>
      </li>
    </ul>
  </a-modal>
</template>
<script setup>
import modelList from "@/config/model.js";
import { IMAGE_ERROR } from "@/config/constant.js";
import { ref } from "vue";
import { message } from "ant-design-vue";
const emit = defineEmits(["onChangeSuccess"]);
const visible = ref(false);
const activeId = ref(null);
const showModal = () => {
  visible.value = true;
};
const onChangeModel = () => {};
const onHandleOk = () => {
  const model = modelList.find((v) => v.id == activeId.value);
  if (!model) {
    return message.warning("请选择模型");
  }
  emit("onChangeSuccess", model);
  visible.value = false;
};
const onCancelModal = () => {
  visible.value = false;
};

defineExpose({
  showModal,
});
</script>

<style scoped lang="less">
.model-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  li {
    cursor: pointer;
    margin: 0px 10px;
    text-align: center;
    padding: 5px;
    box-sizing: border-box;
    /deep/ .ant-image {
      img {
        border-radius: 50%;
      }
    }
  }
  .active {
    border: 1px solid #1890ff;
    background-color: #dbe9f7;
  }
}
</style>
