/**
 * 辅助工具模块方法集合
 *
 * @module HelperModules
 * @description 包含场景中辅助工具(网格、坐标轴等)的控制方法
 * =
 * @exports {Object} default - 导出的方法集合
 * @property {Function} onSetModelRotateOnAxis - 设置模型轴向旋转
 * @property {Function} onResultModelRotateOnAxis - 重置模型旋转状态
 * @property {Function} onSetModelPosition - 设置模型位置
 * @property {Function} onResultModelPosition - 重置模型位置
 * @property {Function} onResetModelCamera - 重置相机位置和视角
 * @property {Function} onGetModelCamera - 获取相机当前位置
 * @property {Function} onSetModelGridHelper - 设置网格辅助线属性
 * @property {Function} onSetModelGridHelperSize - 重建网格辅助线
 * @property {Function} onSetModelAxesHelper - 重建坐标轴辅助线
 */

import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

/**
 * 设置模型轴向旋转
 * @param {string} type - 旋转轴('x'|'y'|'z')
 * @param {boolean} flag - 旋转方向(true为正向,false为反向)
 */
function onSetModelRotateOnAxis(type, flag) {
  const maxAxis = Math.PI / 2;
  const { x, y, z } = this.model.rotation;
  const endPosition = { x, y, z };
  endPosition[type] += flag ? maxAxis : -maxAxis;

  // 创建旋转动画
  new TWEEN.Tween({ x, y, z })
    .to(endPosition, 500)
    .onUpdate(val => {
      this.model.rotation[type] = val[type];
    })
    .start();
}

/**
 * 重置模型旋转状态
 */
function onResultModelRotateOnAxis() {
  this.model.rotation.set(0, 0, 0);
}

/**
 * 设置模型位置
 * @param {Object} position - 目标位置坐标
 * @param {number} position.positionX - X轴坐标
 * @param {number} position.positionY - Y轴坐标
 * @param {number} position.positionZ - Z轴坐标
 */
function onSetModelPosition({ positionX, positionY, positionZ }) {
  // 创建位移动画
  new TWEEN.Tween(this.model.position)
    .to({ x: positionX, y: positionY, z: positionZ }, 500)
    .onUpdate(val => {
      this.model.position.set(val.x || 0, val.y || 0, val.z || 0);
    })
    .start();
}

/**
 * 重置模型位置
 * @param {Object} position - 目标位置坐标
 */
function onResultModelPosition({ positionX, positionY, positionZ }) {
  this.model.position.set(positionX, positionY, positionZ);
}

/**
 * 重置相机位置和视角
 */
function onResetModelCamera() {
  this.camera.position.set(0, 2, 6);
  this.camera.lookAt(0, 0, 0);
}

/**
 * 获取相机当前位置
 * @returns {THREE.Vector3} 相机位置坐标
 */
function onGetModelCamera() {
  return this.camera.position;
}

/**
 * 设置网格辅助线属性
 * @param {Object} config - 网格配置参数
 * @param {number} config.x - X轴位置
 * @param {number} config.y - Y轴位置
 * @param {number} config.z - Z轴位置
 * @param {boolean} config.gridHelper - 是否显示网格
 * @param {string} config.color - 网格颜色
 */
function onSetModelGridHelper({ x, y, z, gridHelper, color }) {
  this.gridHelper.visible = gridHelper;
  this.gridHelper.material.color.set(color);

  // 创建位移动画
  new TWEEN.Tween(this.gridHelper.position)
    .to({ x, y, z }, 500)
    .onUpdate(val => {
      this.gridHelper.position.set(val.x || 0, val.y || 0, val.z || 0);
    })
    .start();
}

/**
 * 重建网格辅助线
 * @param {Object} config - 网格配置参数
 * @param {number} config.size - 网格大小
 * @param {number} config.divisions - 网格分段数
 */
function onSetModelGridHelperSize({ x, y, z, size, divisions, color, gridHelper }) {
  // 清理旧网格
  this.scene.remove(this.gridHelper);
  this.gridHelper.geometry.dispose();
  this.gridHelper.material.dispose();

  // 创建新网格
  this.gridHelper = new THREE.GridHelper(size, divisions, color, color);
  this.gridHelper.position.set(x, y, z);
  this.gridHelper.material.linewidth = 0.1;
  this.gridHelper.material.color.set(color);
  this.gridHelper.visible = gridHelper;
  this.scene.add(this.gridHelper);
}

/**
 * 重建坐标轴辅助线
 * @param {Object} config - 坐标轴配置参数
 * @param {boolean} config.axesHelper - 是否显示坐标轴
 * @param {number} config.axesSize - 坐标轴大小
 */
function onSetModelAxesHelper({ axesHelper, axesSize }) {
  // 清理旧坐标轴
  this.scene.remove(this.axesHelper);
  this.axesHelper.geometry.dispose();
  this.axesHelper.material.dispose();

  // 创建新坐标轴
  this.axesHelper = new THREE.AxesHelper(axesSize);
  this.axesHelper.position.set(0, -0.5, 0);
  this.axesHelper.visible = axesHelper;
  this.scene.add(this.axesHelper);
}

export default {
  onSetModelRotateOnAxis,
  onResultModelRotateOnAxis,
  onSetModelPosition,
  onResultModelPosition,
  onResetModelCamera,
  onGetModelCamera,
  onSetModelGridHelper,
  onSetModelGridHelperSize,
  onSetModelAxesHelper
};
