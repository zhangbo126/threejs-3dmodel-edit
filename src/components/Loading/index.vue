<template>
  <div class="loading-mark">
    <div class="loading-box">
      <div class="loading">
        <img :src="require('@/assets/image/loading.svg')" />
        <div class="loading-txt">加载中...</div>
      </div>
    </div>
  </div>
</template>
<script setup></script>
<style scoped lang="less">
.loading-mark {
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
		width: 100px;
		height: 100px;
	  }
	  .loading-txt {
		text-align: center;
		font-size: 14px;
		color: #ff7c81;
	  }
  }
}


</style>
