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
              <el-icon size="20px" color="#2a3ff6">
                <Check />
              </el-icon>
            </div>
          </el-space>
        </div>
      </el-scrollbar>
      <el-empty v-else description="暂无动画" :image-size="120" />
    </div>
    <!-- 动画配置 -->
    <div class="header">
      <span>动画配置</span>
    </div>
    <div class="options" :class="optionDisabled">
      <div class="option">
        <el-space>
          <el-icon>
            <Switch />
          </el-icon>
          <span> 循环方式 </span>
        </el-space>
      </div>
      <div class="option">
        <el-radio-group v-model="config.loop" @change="onUpdateAnimation">
          <el-radio-button value="LoopOnce">只执行一次</el-radio-button>
          <el-radio-button value="LoopRepeat">无限循环</el-radio-button>
          <el-radio-button value="LoopPingPong">来回循环</el-radio-button>
        </el-radio-group>
      </div>
      <div class="option">
        <el-space>
          <el-icon>
            <VideoPlay />
          </el-icon>
          <span> 播放速度 </span>
        </el-space>
      </div>
      <div class="option">
        <el-slider show-input v-model="config.timeScale" @change="onUpdateAnimation" :step="0.01" :min="0" :max="1" />
      </div>
      <div class="option">
        <el-space>
          <el-icon>
            <Sort />
          </el-icon>
          <span> 动作幅度 </span>
        </el-space>
      </div>
      <div class="option">
        <el-slider show-input v-model="config.weight" @change="onUpdateAnimation" :step="0.01" :min="0" :max="1" />
      </div>
    </div>
    <!-- 轴动画 -->
    <div class="header">
      <span>轴动画</span>
      <el-switch v-model="config.rotationVisible" @change="onRotationAnimation" />
    </div>
    <div class="options">
      <div class="option" :class="optionRotation">
        <el-space>
          <span> 轴方向 </span>
          <el-radio-group v-model="config.rotationType" @change="onRotationType">
            <el-radio-button value="x">X轴</el-radio-button>
            <el-radio-button value="y">Y轴</el-radio-button>
            <el-radio-button value="z">Z轴</el-radio-button>
          </el-radio-group>
        </el-space>
      </div>
      <div class="option" :class="optionRotation">
        <el-space>
          <el-icon>
            <VideoPlay />
          </el-icon>
          <span> 播放速度 </span>
        </el-space>
      </div>
      <div class="option" :class="optionRotation">
        <el-slider @input="onRotationAnimation" show-input v-model="config.rotationSpeed" :step="0.01" :min="1" :max="10" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, computed, onMounted, getCurrentInstance } from "vue";
import { useMeshEditStore } from "@/store/meshEditStore";
const store = useMeshEditStore();
const { $bus } = getCurrentInstance().proxy;
const config = reactive({
  visible: false,
  animationName: null, //动画名称
  loop: "LoopRepeat", // 循环方式 TODO:LoopOnce 执行一次 LoopRepeat 循环执行  LoopPingPong 来回执行
  timeScale: 1, // 播放速度
  weight: 1, // 动作幅度
  rotationVisible: false, //轴动画开关
  rotationType: "y", // 轴类型
  rotationSpeed: 1 // 旋转速度
});
const optionDisabled = computed(() => {
  return config.visible ? "" : "disabled";
});
const optionRotation = computed(() => {
  return config.rotationVisible ? "" : "disabled";
});

const state = reactive({
  // 模型动画
  modelAnimation: computed(() => {
    if (store.modelApi) {
      return store.modelApi.modelAnimation;
    }
    return [];
  })
});

onMounted(() => {
  if (state.modelAnimation.length) {
    config.animationName = state.modelAnimation[0].name;
  }
  // 监听模型变化
  $bus.on("update-model", () => {
    if (state.modelAnimation.length) {
      const animationName = state.modelAnimation[0].name;
      config.animationName = animationName;
    }
    // 重置动画数据
    Object.assign(config, {
      visible: false,
      loop: "LoopRepeat", // 循环方式 TODO:LoopOnce 执行一次 LoopRepeat 循环执行  LoopPingPong 来回执行
      timeScale: 1, // 播放速度
      weight: 1, // 动作幅度
      rotationVisible: false, //轴动画开关
      rotationType: "y", // 轴类型
      rotationSpeed: 1 // 旋转速度
    });
  });
});

// 动画开启/关闭
const onChangeAnimationSwitch = () => {
  const { visible } = config;
  if (visible) {
    onUpdateAnimation();
  } else {
    store.modelApi.onClearAnimation();
  }
};
// 选择动画
const onChangeAnimationType = ({ name }) => {
  config.animationName = name;
  store.modelApi.onStartModelAnimation(config);
};
// 更新模型状态
const onUpdateAnimation = () => {
  store.modelApi.onStartModelAnimation(config);
};

// 设置模型轴动画
const onRotationAnimation = () => {
  store.modelApi.onSetRotation(config);
};
// 设置模型轴动画类型
const onRotationType = () => {
  store.modelApi.onSetRotationType(config);
};

defineExpose({
  config
});
</script>
<style scoped lang="scss"></style>
