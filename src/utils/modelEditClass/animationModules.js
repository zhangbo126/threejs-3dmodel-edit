/**
 * 模型动画模块方法集合
 *
 * @module AnimationModules
 * @description 包含模型动画相关的控制方法
 *
 * @exports {Object} default - 导出的方法集合
 * @property {Function} onStartModelAnimation - 开始执行动画
 * @property {Function} onSetModelAnimation - 设置模型动画参数
 * @property {Function} animationFrameFun - 动画帧更新
 * @property {Function} onClearAnimation - 清除动画
 * @property {Function} onSetRotation - 设置模型旋转动画
 * @property {Function} onSetRotationType - 设置旋转轴和速度
 * @property {Function} getModelAnimationList - 获取模型动画列表
 * @property {Function} getManyModelAnimationList - 获取多模型动画列表
 */

import * as THREE from "three";

/**
 * 开始执行动画
 * @param {Object} config - 动画配置参数
 */
function onStartModelAnimation(config) {
  this.onSetModelAnimation(config);
  cancelAnimationFrame(this.animationFrame);
  this.animationFrameFun();
}

/**
 * 设置模型动画参数
 * @param {Object} params - 动画参数
 * @param {string} params.animationName - 动画名称
 * @param {string} params.loop - 循环类型
 * @param {number} params.timeScale - 动画速度
 * @param {number} params.weight - 动画权重
 */
function onSetModelAnimation({ animationName, loop, timeScale, weight }) {
  this.animationMixer = new THREE.AnimationMixer(this.model);
  const clip = THREE.AnimationClip.findByName(this.modelAnimation, animationName);
  if (clip) {
    this.animateClipAction = this.animationMixer.clipAction(clip);
    this.animateClipAction.setEffectiveTimeScale(timeScale);
    this.animateClipAction.setEffectiveWeight(weight);
    this.animateClipAction.setLoop(this.loopMap[loop]);
    this.animateClipAction.play();
  }
}

/**
 * 动画帧更新
 */
function animationFrameFun() {
  this.animationFrame = requestAnimationFrame(() => this.animationFrameFun());
  if (this.animationMixer) {
    this.animationMixer.update(this.animationClock.getDelta());
  }
}

/**
 * 清除所有动画
 */
function onClearAnimation() {
  if (!this.animateClipAction) return;
  this.animationMixer.stopAllAction();
  this.animationMixer.update(0);
  cancelAnimationFrame(this.animationFrame);
}

/**
 * 设置模型旋转动画
 * @param {Object} config - 旋转配置
 * @param {boolean} config.rotationVisible - 是否显示旋转
 * @param {string} config.rotationType - 旋转轴类型
 * @param {number} config.rotationSpeed - 旋转速度
 */
function onSetRotation(config) {
  const { rotationVisible, rotationType, rotationSpeed } = config;
  if (rotationVisible) {
    cancelAnimationFrame(this.rotationAnimationFrame);
    this.rotationAnimationFun(rotationType, rotationSpeed);
  } else {
    cancelAnimationFrame(this.rotationAnimationFrame);
    this.model.rotation.set(0, 0, 0);
  }
}

/**
 * 设置旋转轴和速度
 * @param {Object} config - 旋转配置
 * @param {string} config.rotationType - 旋转轴类型
 * @param {number} config.rotationSpeed - 旋转速度
 */
function onSetRotationType(config) {
  const { rotationType, rotationSpeed } = config;
  this.model.rotation.set(0, 0, 0);
  cancelAnimationFrame(this.rotationAnimationFrame);
  this.rotationAnimationFun(rotationType, rotationSpeed);
}

/**
 * 旋转动画帧更新
 * @param {string} rotationType - 旋转轴类型
 * @param {number} rotationSpeed - 旋转速度
 */
function rotationAnimationFun(rotationType, rotationSpeed) {
  this.rotationAnimationFrame = requestAnimationFrame(() => this.rotationAnimationFun(rotationType, rotationSpeed));
  this.model.rotation[rotationType] += rotationSpeed / 50;
}

/**
 * 获取当前模型动画列表
 * @param {Object} result - 包含动画数据的对象
 */
function getModelAnimationList(result) {
  this.modelAnimation = result.animations || [];
}

/**
 * 获取多模型动画列表
 * @param {Array} animations - 动画数组
 */
function getManyModelAnimationList(animations) {
  if (Array.isArray(animations)) {
    this.modelAnimation = this.modelAnimation.concat(animations);
  }
}

export default {
  onStartModelAnimation,
  onSetModelAnimation,
  animationFrameFun,
  onClearAnimation,
  onSetRotation,
  onSetRotationType,
  rotationAnimationFun,
  getModelAnimationList,
  getManyModelAnimationList
};
