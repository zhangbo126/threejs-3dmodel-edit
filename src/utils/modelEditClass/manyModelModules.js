/**
 * 多模型管理模块
 *
 * @module ManyModelModules
 * @description 提供多个3D模型的选择、删除、位置、旋转和缩放等操作方法
 *
 * @exports {Object} default - 导出的方法集合
 * @property {Function} chooseManyModel - 选择当前模型并返回其变换信息
 * @property {Function} deleteManyModel - 删除指定模型
 * @property {Function} setManyModelRotation - 旋转指定模型
 * @property {Function} initManyModelRotation - 重置模型旋转状态
 * @property {Function} setManyModelPosition - 设置模型位置
 * @property {Function} initManyModelPosition - 重置模型位置
 * @property {Function} setManyModelScale - 设置模型缩放
 */

import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { toRaw } from "vue";

/**
 * 选择当前模型并返回其变换信息
 * @param {string} uuid - 模型的唯一标识符
 * @returns {Object} 模型的位置、旋转和缩放信息
 */
function chooseManyModel(uuid) {
  const manyModel = this.scene.getObjectByProperty("uuid", uuid);

  // 设置模型轮廓效果
  this.outlinePass.visibleEdgeColor = new THREE.Color("#409eff");
  this.outlinePass.hiddenEdgeColor = new THREE.Color("#0099cc");
  this.outlinePass.selectedObjects = [toRaw(manyModel)];

  if (manyModel) {
    const { position, rotation, userData, scale } = manyModel.clone();
    // 保存初始变换信息
    manyModel.userData = {
      ...userData,
      position,
      rotation,
      scale
    };
    return {
      position: { ...position },
      rotation: { ...rotation },
      scale: scale.x
    };
  }
  return {};
}

/**
 * 删除指定模型
 * @param {string} uuid - 模型的唯一标识符
 */
function deleteManyModel(uuid) {
  const manyModel = this.scene.getObjectByProperty("uuid", uuid);
  if (!manyModel) return;

  this.manyModelGroup.remove(manyModel);
  this.outlinePass.selectedObjects = [];
}

/**
 * 旋转指定模型
 * @param {string} type - 旋转轴('x'|'y'|'z')
 * @param {boolean} flag - 旋转方向(true为正向,false为反向)
 * @param {string} uuid - 模型的唯一标识符
 */
function setManyModelRotation(type, flag, uuid) {
  const manyModel = this.scene.getObjectByProperty("uuid", uuid);
  if (!manyModel) return;

  const maxAxis = Math.PI / 2;
  const { x, y, z } = manyModel.rotation;
  const endPosition = { x, y, z };
  endPosition[type] += flag ? maxAxis : -maxAxis;

  // 创建旋转动画
  const Tween = new TWEEN.Tween({ x, y, z })
    .to(endPosition, 500)
    .onUpdate(val => {
      manyModel.rotation[type] = val[type];
    })
    .start();
}

/**
 * 重置模型旋转状态
 * @param {string} uuid - 模型的唯一标识符
 */
function initManyModelRotation(uuid) {
  const manyModel = this.scene.getObjectByProperty("uuid", uuid);
  if (!manyModel) return;

  const { rotation } = manyModel.userData;
  manyModel.rotation.set(rotation.x, rotation.y, rotation.z);
}

/**
 * 设置模型位置
 * @param {Object} position - 目标位置坐标
 * @param {string} uuid - 模型的唯一标识符
 */
function setManyModelPosition(position, uuid) {
  const manyModel = this.scene.getObjectByProperty("uuid", uuid);
  if (!manyModel) return;

  // 创建位移动画
  const Tween = new TWEEN.Tween(manyModel.position)
    .to(
      {
        x: position.x,
        y: position.y,
        z: position.z
      },
      500
    )
    .onUpdate(val => {
      manyModel.position.set(val.x || 0, val.y || 0, val.z || 0);
    })
    .start();
}

/**
 * 重置模型位置
 * @param {string} uuid - 模型的唯一标识符
 * @returns {Object} 重置后的位置信息
 */
function initManyModelPosition(uuid) {
  const manyModel = this.scene.getObjectByProperty("uuid", uuid);
  const { position } = manyModel.userData;
  manyModel.position.set(position.x || 0, position.y || 0, position.z || 0);
  return { ...position };
}

/**
 * 设置模型缩放
 * @param {string} uuid - 模型的唯一标识符
 * @param {number} scale - 缩放比例
 */
function setManyModelScale(uuid, scale) {
  const manyModel = this.scene.getObjectByProperty("uuid", uuid);
  if (!manyModel) return;

  // 创建缩放动画
  const Tween = new TWEEN.Tween(manyModel.scale)
    .to(
      {
        x: scale,
        y: scale,
        z: scale
      },
      500
    )
    .onUpdate(val => {
      manyModel.scale.set(val.x || 0, val.y || 0, val.z || 0);
    })
    .start();
}

export default {
  chooseManyModel,
  deleteManyModel,
  setManyModelRotation,
  initManyModelRotation,
  setManyModelPosition,
  initManyModelPosition,
  setManyModelScale
};
