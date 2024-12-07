/**
 * 灯光模块方法集合
 *
 * @module LightModules
 * @description 包含场景中各种光源的控制方法
 *
 * @exports {Object} default - 导出的方法集合
 * @property {Function} onSetModelAmbientLight - 环境光控制
 * @property {Function} onSetModelDirectionalLight - 平行光控制
 * @property {Function} onSetModelPointLight - 点光源控制
 * @property {Function} onSetModelSpotLight - 聚光灯控制
 * @property {Function} onResettingLight - 重置所有光源
 */

import { lightPosition } from "@/utils/utilityFunction";

/**
 * 设置环境光参数
 * @param {Object} params - 环境光配置参数
 * @param {boolean} params.ambientLight - 是否启用环境光
 * @param {string} params.ambientLightColor - 环境光颜色
 * @param {number} params.ambientLightIntensity - 环境光强度
 */
function onSetModelAmbientLight({ ambientLight, ambientLightColor, ambientLightIntensity }) {
  this.ambientLight.visible = ambientLight;
  this.ambientLight.intensity = ambientLightIntensity;
  this.ambientLight.color.set(ambientLightColor);
}

/**
 * 设置平行光参数
 * @param {Object} config - 平行光配置参数
 */
function onSetModelDirectionalLight(config) {
  const {
    directionShadow,
    directionalHorizontal,
    directionalVertical,
    directionalSistine,
    directionalLight,
    directionalLightColor,
    directionalLightIntensity,
    directionalLightHelper
  } = config;

  this.directionalLight.visible = directionalLight;
  this.directionalLightHelper.visible = directionalLightHelper && directionalLight;
  this.directionalLight.intensity = directionalLightIntensity;
  this.directionalLight.castShadow = directionShadow;
  this.directionalLight.color.set(directionalLightColor);

  const position = lightPosition(directionalHorizontal, directionalVertical, directionalSistine);
  this.directionalLight.position.set(position.x, position.y, position.z);
  this.directionalLightHelper.update();
}

/**
 * 设置点光源参数
 * @param {Object} config - 点光源配置参数
 */
function onSetModelPointLight(config) {
  const { pointHorizontal, pointVertical, pointDistance, pointLight, pointLightColor, pointLightIntensity, pointLightHelper } =
    config;

  this.pointLight.visible = pointLight;
  this.pointLightHelper.visible = pointLight && pointLightHelper;
  this.pointLight.intensity = pointLightIntensity;
  this.pointLight.color.set(pointLightColor);

  const position = lightPosition(pointHorizontal, pointVertical, pointDistance);
  this.pointLight.position.set(position.x, position.y, position.z);
  this.pointLightHelper.update();
}

/**
 * 设置聚光灯参数
 * @param {Object} config - 聚光灯配置参数
 */
function onSetModelSpotLight(config) {
  const {
    spotDistance,
    spotCastShadow,
    spotLightHelper,
    spotFocus,
    spotPenumbra,
    spotAngle,
    spotLight,
    spotLightColor,
    spotLightIntensity,
    spotHorizontal,
    spotVertical,
    spotSistine
  } = config;

  this.spotLight.visible = spotLight;
  this.spotLightHelper.visible = spotLight && spotLightHelper;
  this.spotLight.intensity = spotLightIntensity;
  this.spotLight.angle = spotAngle;
  this.spotLight.penumbra = spotPenumbra;
  this.spotLight.shadow.focus = spotFocus;
  this.spotLight.castShadow = spotCastShadow;
  this.spotLight.distance = spotDistance;
  this.spotLight.color.set(spotLightColor);

  const position = lightPosition(spotHorizontal, spotVertical, spotSistine);
  this.spotLight.position.set(position.x, position.y, position.z);
  this.spotLightHelper.update();
}

/**
 * 重置所有光源到默认状态
 * @param {Object} params - 重置参数
 * @param {boolean} params.ambientLight - 是否启用环境光
 */
function onResettingLight({ ambientLight }) {
  const defaultConfig = {
    // 基础场景配置
    planeColor: "#939393",
    planeWidth: 7,
    planeHeight: 7,

    // 环境光配置
    ambientLight,
    ambientLightColor: "#fff",
    ambientLightIntensity: 0.8,

    // 平行光配置
    directionalLight: false,
    directionalLightHelper: true,
    directionalLightColor: "#1E90FF",
    directionalLightIntensity: 1,
    directionalHorizontal: -1.26,
    directionalVertical: -3.85,
    directionalSistine: 2.98,
    directionShadow: true,

    // 点光源配置
    pointLight: false,
    pointLightHelper: true,
    pointLightColor: "#1E90FF",
    pointLightIntensity: 1,
    pointHorizontal: -4.21,
    pointVertical: -4.1,
    pointDistance: 2.53,

    // 聚光灯配置
    spotLight: false,
    spotLightColor: "#323636",
    spotLightIntensity: 400,
    spotHorizontal: -3.49,
    spotVertical: -4.37,
    spotSistine: 4.09,
    spotAngle: 0.5,
    spotPenumbra: 1,
    spotFocus: 1,
    spotCastShadow: true,
    spotLightHelper: true,
    spotDistance: 20
  };

  this.onSetModelAmbientLight(defaultConfig);
  this.onSetModelDirectionalLight(defaultConfig);
  this.onSetModelPointLight(defaultConfig);
  this.onSetModelSpotLight(defaultConfig);
}

export default {
  onSetModelAmbientLight,
  onSetModelDirectionalLight,
  onSetModelPointLight,
  onSetModelSpotLight,
  onResettingLight
};
