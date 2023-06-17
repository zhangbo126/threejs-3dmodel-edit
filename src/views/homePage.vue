<template>
  <div class="home-page">
    <div id="model"></div>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { onMounted, ref, reactive } from "vue";

const model = reactive({
  scene: ref(new THREE.Scene()), //场景
  renderer: new THREE.WebGLRenderer({ antialias: true }), // web渲染器
  camera: null, //相机
});

onMounted(() => {
  window.addEventListener('resize',()=>{
    let container = document.getElementById("model");
    const { clientHeight, clientWidth } = container;
     // 设置渲染器大小
    model.renderer.setSize(container.clientWidth, container.clientHeight);  
  })
  initModel();
});
//初始化模型场景
const initModel = () => {
  const { scene, renderer, camera } = model;
  let container = document.getElementById("model");
  const { clientHeight, clientWidth } = container;
  // 70:视场角度, clientWidth / height:clientHeight画布宽高比, 1:近裁截面, 3000：远裁截面
  model.camera = new THREE.PerspectiveCamera(70, clientWidth / clientHeight, 1, 3000);
  model.camera.position.z = 1;
  model.camera.position.y = 0.01;
  // 设置渲染器大小
  model.renderer.setSize(container.clientWidth, container.clientHeight);
  //设置场景背景颜色
  model.scene.background = new THREE.Color(0x8cc7de);
  
  let mixer = THREE.AnimationMixer()
  const loader = new GLTFLoader().setPath()

  model.renderer.render(model.scene, model.camera);
  container.appendChild(model.renderer.domElement);
};
</script>

<style lang="less" scoped>
.home-page {
  #model {
    width: 100%;
    height: 100vh;
  }
}
</style>
