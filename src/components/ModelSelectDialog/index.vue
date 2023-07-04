<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    draggable
    width="750px"
    title="请选择模型"
    @close="onCancelDialog"
  >
    <ul class="model-list">
      <li
        v-for="model in modelList"
        :class="model.id == activeId ? 'active' : ''"
        :key="model.id"
        @click="activeId = model.id"
      >
        <div class="model-icon">
          <el-image :style="{ width: '100px', height: '100px' }" :src="model.icon">
          </el-image>
        </div>
        <div class="model-name">
          <span>{{ model.name }}</span>
        </div>
      </li>
    </ul>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancelDialog">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { modelList } from "@/config/model.js";
import { IMAGE_ERROR } from "@/config/constant.js";
import { ref } from "vue";
import { ElMessage } from "element-plus";
const emit = defineEmits(["onChangeSuccess"]);
const visible = ref(false);
const activeId = ref(null);
const showDialog = () => {
  visible.value = true;
};
const onSubmit = () => {
  const model = modelList.find((v) => v.id == activeId.value);
  if (!model) {
    return ElMessage.warning("请选择模型");
  }
  emit("onChangeSuccess", model);
  visible.value = false;
};
const onCancelDialog = () => {
  visible.value = false;
};

defineExpose({
	showDialog,
});
</script>

<style scoped lang="less">
.model-list {
  display: flex;
  flex-wrap: wrap;
  li {
    cursor: pointer;
    margin: 0px 15px;
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
