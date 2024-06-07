<template>
  <div id="loading-mark">
    <div class="loading-box">
      <div class="loading">
        <img src="@/assets/image/loading.svg" />
        <div class="loading-txt">模型文件首次加载时间较长请耐心等待...</div>
      </div>
    </div>
  </div>
</template>
<script setup>

</script>
<style scoped lang="scss">
#loading-mark {
  position: absolute;
  inset: 0;
  z-index: 2000;
  width: 100%;
  height: 100%;
  .loading-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 64%);
    transition: opacity 0.3s;
    .loading {
      width: 200px;
      height: 120px;
      text-align: center;
    }
    .loading-txt {
      font-size: 14px;
      color: #ff7c81;
      text-align: center;
    }
  }
}
</style>
