<template>
  <el-dialog v-model="visible" width="600px" :close-on-click-modal="false">
    <p class="tip-message">3D模型可视化编辑系统的升级版(↓)</p>
    <ul class="info-list">
      <li class="info-item">
        <span class="label">项目名称:</span>
        <span class="content">3D模型场景编辑器</span>
      </li>
      <li class="info-item">
        <span class="label">描述:</span>
        <span class="content"> 提供更加强大灵活便捷流畅的3D模型场景操作编辑功能 </span>
      </li>
      <li class="info-item">
        <span class="label">技术栈:</span>
        <span class="content">Three.js176+Vue3.0/Three.js176+React18</span>
      </li>
      <li class="info-item">
        <span class="label">在线地址：</span>
        <el-link
          class="link-content"
          type="primary"
          :underline="false"
          target="_blank"
          href="https://three3d-0gte3eg619c78ffd-1301256746.tcloudbaseapp.com/threejs-model-edit-pro/"
        >
          https://threejs-model-edit-pro</el-link
        >
      </li>
    </ul>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" class="copy-button" @click="cloneDialog"> 关闭 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { defineExpose, ref } from "vue";
const visible = ref(false);
const showDialog = () => {
  visible.value = true;
};

const cloneDialog = () => {
  visible.value = false;
};

defineExpose({ showDialog });
</script>

<style lang="scss" scoped>
.tip-message {
  padding: 16px 20px;
  margin: 0 0 20px;
  line-height: 1.6;
  color: #666666;
  background: #f8f9fa;
  border-left: 4px solid #409eff;
  border-radius: 4px;
}
.info-list {
  padding: 0 20px;
  margin: 0;
  list-style: none;
  background: #f8f9fa;
  border-radius: 8px;
  .info-item {
    display: flex;
    align-items: flex-start;
    padding: 12px 0;
    &:not(:last-child) {
      border-bottom: 1px dashed #e0e0e0;
    }
    .label {
      position: relative;
      flex-shrink: 0;
      width: 90px;
      padding-left: 12px;
      font-weight: 500;
      color: #666666;
      &::before {
        position: absolute;
        top: 50%;
        left: 0;
        width: 4px;
        height: 16px;
        content: "";
        background: #409eff;
        border-radius: 2px;
        transform: translateY(-50%);
      }
    }
    .content {
      flex: 1;
      line-height: 1.6;
      color: #333333;
    }
    .link-content {
      font-size: 14px;
      transition: all 0.3s;
      &:hover {
        color: #66b1ff;
        text-decoration: underline;
      }
    }
  }
}
</style>
