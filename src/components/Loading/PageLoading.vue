<template>
  <div id="loading-mark" v-if="props.loading">
    <div class="loading-box">
      <div class="loading">
        <img :src="require('@/assets/image/loading.svg')" />
        <div class="progress-txt">
           当前模型已加载{{ props.percentage }} M
        </div>
        <div class="loading-txt">
           模型文件首次加载时间较长请耐心等待.....
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ElProgress } from "element-plus";
const props = defineProps({
  percentage: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>
<style scoped lang="less">
#loading-mark {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2000;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  .loading-box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.3s;
    background-color: rgb(0 0 0 / 64%);

    .loading {
      width: 320px;
      height: 120px;
      text-align: center;
    }

    .loading-txt,.progress-txt {
      text-align: center;
      font-size: 14px;
      color: #ff7c81;
    }
  }
}
</style>
