<template>
  <div class="edit-box">
    <div class="header">
      <span>模型动画</span>
      <el-switch v-model="config.visible" @change="onChangeAnimationSwitch" />
    </div>
    <!-- 动画列表 -->
    <div class="options" :class="optionDisabled">
      <el-scrollbar max-height="250px" v-if="state.modelAnimation.length">
        <div
          class="option"
          :class="config.animationName == animation.name ? 'option-active' : ''"
          @click="onChangeAnimationType(animation)"
          v-for="animation in state.modelAnimation"
          :key="animation.name"
        >
          <el-space>
            <div class="icon-name">
              {{ animation.name }}
            </div>
            <div class="check" v-show="config.animationName == animation.name">
              <el-icon size="20px" color="#2a3ff6"><Check /></el-icon>
            </div>
          </el-space>
        </div>
      </el-scrollbar>
      <el-empty v-else description="暂无动画" :image-size="200" />
    </div>
    <!-- 动画配置 -->
    <div class="header">
      <span>动画配置</span>
    </div>
    <div class="options" :class="optionDisabled">
      <div class="option">
        <el-space>
          <el-icon><Switch /></el-icon>
          <span> 循环方式 </span>
        </el-space>
      </div>
      <div class="option">
        <el-radio-group v-model="config.loop" @change="onUplateAnimation">
          <el-radio-button label="LoopOnce">只执行一次</el-radio-button>
          <el-radio-button label="LoopRepeat">无限循环</el-radio-button>
          <el-radio-button label="LoopPingPong">来回循环</el-radio-button>
        </el-radio-group>
      </div>
      <div class="option">
        <el-space>
          <el-icon><VideoPlay /></el-icon>
          <span> 播放速度 </span>
        </el-space>
      </div>
      <div class="option">
        <el-slider
          v-model="config.timeScale"
          @change="onUplateAnimation"
          :step="0.01"
          :min="0"
          :max="1"
        />
      </div>
      <div class="option">
        <el-space>
          <el-icon><Sort /></el-icon>
          <span> 动作幅度 </span>
        </el-space>
      </div>
      <div class="option">
        <el-slider
          v-model="config.weight"
          @change="onUplateAnimation"
          :step="0.01"
          :min="0"
          :max="1"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed } from "vue";
import { useStore } from "vuex";
const store = useStore();
const config = reactive({
  visible: true,
  animationName: null, //动画名称
  loop: "LoopRepeat", // 循环方式 TODO:LoopOnce 执行一次 LoopRepeat 循环执行  LoopPingPong 来回执行
  timeScale: 1, // 播放速度
  weight: 1, // 动作幅度
  animations: [],
});
const optionDisabled = computed(() => {
  return config.visible ? "" : "disabled";
});
const state = reactive({
  modelApi: computed(() => {
    return store.state.modelApi;
  }),
  // 模型动画
  modelAnimation: computed(() => {
    if (store.state.modelApi) {
      return store.state.modelApi.modelAnimation;
    }
    return [];
  }),
});

// 动画开启/关闭
const onChangeAnimationSwitch = () => {
  const { visible } = config;
  if (visible) {
    onUplateAnimation();
  } else {
    state.modelApi.onClearAnimation();
  }
};
// 选择动画
const onChangeAnimationType = ({ name }) => {
  config.animationName = name;
  config.animations = state.modelAnimation;
  state.modelApi.onStartModelAnimaion(config);
};
// 更新模型状态
const onUplateAnimation = () => {
  config.animations = state.modelAnimation;
  state.modelApi.onStartModelAnimaion(config);
};

</script>
<style scoped lang="scss"></style>
