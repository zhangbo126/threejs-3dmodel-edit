/**
 * 后期/操作模块方法集合
 *
 * @module StageFlowModules
 * @description 包含模型后期效果和操作相关的方法
 *
 * @exports {Object} default - 导出的方法集合
 * @property {Function} onSetUnrealBloomPass - 设置辉光效果
 * @property {Function} setModelMeshDecompose - 模型拆分动画
 * @property {Function} setModelMeshDrag - 模型材质拖拽控制
 * @property {Function} getMeshDragPosition - 获取模型材质拖拽位置
 * @property {Function} onSetFlowColor - 修改辉光颜色
 * @property {Function} initStageFlow - 重置所有效果和状态
 * @property {Function} setTransformControlsType - 设置变换控制器类型
 */

import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { findObjectInScene } from "@/utils/utilityFunction.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { MODEL_DECOMPOSE } from "@/config/constant.js";

/**
 * 设置辉光效果
 * @param {Object} config - 辉光配置参数
 * @param {boolean} config.glow - 是否开启辉光
 * @param {number} config.threshold - 辉光阈值
 * @param {number} config.strength - 辉光强度
 * @param {number} config.radius - 辉光半径
 * @param {number} config.toneMappingExposure - 色调映射曝光度
 * @param {string} config.color - 辉光颜色
 */
function onSetUnrealBloomPass(config) {
  const { glow, threshold, strength, radius, toneMappingExposure, color } = config;
  this.glowUnrealBloomPass = glow;

  if (glow) {
    this.unrealBloomPass.threshold = threshold;
    this.unrealBloomPass.strength = strength;
    this.unrealBloomPass.radius = radius;
    this.renderer.toneMappingExposure = toneMappingExposure;
    this.shaderPass.material.uniforms.glowColor.value = new THREE.Color(color);

    // 动态添加着色器,避免性能浪费
    const passesArray = this.effectComposer.passes || [];
    const shaderColor = passesArray.find(v => v.name === "ShaderColor");
    if (!shaderColor) {
      this.effectComposer.addPass(this.shaderPass);
    }
  } else {
    // 关闭辉光效果
    this.unrealBloomPass.threshold = 0;
    this.unrealBloomPass.strength = 0;
    this.unrealBloomPass.radius = 0;
    this.renderer.toneMappingExposure = toneMappingExposure;
    this.shaderPass.material.uniforms.glowColor.value = new THREE.Color();
    this.glowComposer.renderer.clear();
    this.glowComposer.renderer.dispose();
    this.effectComposer.removePass(this.shaderPass);
  }
}

/**
 * 模型拆分动画
 * @param {Object} params - 拆分参数
 * @param {number} params.decompose - 拆分距离
 * @returns {boolean} - 如果材质列表为空或只有一个,返回false
 */
function setModelMeshDecompose({ decompose }) {
  if (this.glowMaterialList.length <= 1) return false;

  // 创建拆分动画
  const modelDecomposeMove = (obj, position) => {
    const tween = new TWEEN.Tween(obj.position)
      .to(position, 500)
      .onUpdate(val => obj.position.set(val.x || 0, val.y || 0, val.z || 0))
      .start();
  };

  const length = this.glowMaterialList.length;
  const angleStep = (2 * Math.PI) / length;

  this.glowMaterialList.forEach((name, i) => {
    const mesh = this.model.getObjectByName(name);
    const { decomposeName } = this.model;

    if (mesh.type === "Mesh") {
      // 处理自定义拆分参数
      if (MODEL_DECOMPOSE[decomposeName]?.[name]) {
        const position = { x: 0, y: 0, z: 0 };
        const { x: modelX, y: modelY, z: modelZ } = MODEL_DECOMPOSE[decomposeName][name];

        ["x", "y", "z"].forEach(axis => {
          const direction = { modelX, modelY, modelZ }[`model${axis.toUpperCase()}`];
          if (direction === "straight") {
            position[axis] += decompose;
          } else if (direction === "burden") {
            position[axis] -= decompose;
          }
        });

        modelDecomposeMove(mesh, position);
      } else {
        // 默认圆形拆分
        const angle = i * angleStep;
        modelDecomposeMove(mesh, {
          x: decompose * Math.cos(angle),
          y: decompose * Math.sin(angle),
          z: 0
        });
      }
    }
  });
}

/**
 * 设置模型材质拖拽控制
 * @param {Object} params - 控制参数
 * @param {boolean} params.manageFlag - 是否启用拖拽
 */
function setModelMeshDrag({ manageFlag }) {
  if (manageFlag && !this.transformControls) {
    this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
    this.transformControls.setMode("translate");
    this.transformControls.addEventListener("dragging-changed", event => {
      this.controls.enabled = !event.value;
    });
    this.transformControls.size = 1;
    this.transformControls.attach();

    const gizmo = this.transformControls.getHelper();
    this.scene.add(gizmo);
  } else {
    this.transformControls?.detach();
    const transformControlsPlane = findObjectInScene(this.scene, { type: "TransformControlsPlane" });
    if (transformControlsPlane) {
      this.scene.remove(transformControlsPlane);
    }
  }
}

/**
 * 设置变换控制器类型
 * @param {string} type - 控制器类型
 */
function setTransformControlsType(type) {
  this.transformControls.setMode(type);
}

/**
 * 获取模型材质拖拽位置
 * @returns {Array<Object>} 包含每个材质位置信息的数组
 */
function getMeshDragPosition() {
  return this.modelMaterialList.map(v => {
    const mesh = this.model.getObjectByProperty("name", v.name);
    const { rotation, scale, position } = mesh;

    return {
      name: v.name,
      rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
      scale: { x: scale.x, y: scale.y, z: scale.z },
      position: { x: position.x, y: position.y, z: position.z }
    };
  });
}

/**
 * 修改辉光颜色
 * @param {string} color - 辉光颜色值
 */
function onSetFlowColor(color) {
  this.shaderPass.material.uniforms.glowColor.value = new THREE.Color(color);
}

/**
 * 重置所有效果和状态
 */
function initStageFlow() {
  // 重置渲染器和辉光参数
  this.renderer.toneMappingExposure = 2;
  Object.assign(this.unrealBloomPass, {
    threshold: 0,
    strength: 0,
    radius: 0
  });

  // 清除辉光效果
  this.shaderPass.material.uniforms.glowColor.value = new THREE.Color();
  this.glowUnrealBloomPass = false;
  this.glowComposer.renderer.clear();
  this.glowComposer.renderer.dispose();

  // 清除变换控制器
  if (this.transformControls) {
    this.transformControls.detach();
    const transformControlsPlane = findObjectInScene(this.scene, { type: "TransformControlsPlane" });
    if (transformControlsPlane) {
      this.scene.remove(transformControlsPlane);
    }
    this.scene.remove(this.transformControls);
    this.transformControls = null;
  }

  // 移除着色器通道
  this.effectComposer.removePass(this.shaderPass);

  // 重置模型位置
  this.model.traverse(v => {
    if (v.isMesh && v.material) {
      const { rotation, scale, position } = v.userData;
      v.rotation.set(rotation.x, rotation.y, rotation.z);
      v.scale.set(scale.x, scale.y, scale.z);
      v.position.set(position.x, position.y, position.z);
    }
  });
}

export default {
  onSetUnrealBloomPass,
  setModelMeshDecompose,
  setModelMeshDrag,
  getMeshDragPosition,
  onSetFlowColor,
  initStageFlow,
  setTransformControlsType
};
