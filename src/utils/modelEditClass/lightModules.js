/**
 * @describe 灯光模块方法
 * @function onSetModelAmbientLight 设置环境光
 * @function onSetModelDirectionalLight 设置平行光
 * @function onSetModelPointLight 设置点光源
 * @function onSetModelSpotLight 设置聚光灯
 * @function onResettingLight 重置场景灯光
 */
import * as THREE from "three";
import { lightPosition } from "@/utils/utilityFunction";

// 设置环境光
function onSetModelAmbientLight({ ambientLight, ambientLightColor, ambientLightIntensity }) {
  this.ambientLight.visible = ambientLight;
  this.ambientLight.intensity = ambientLightIntensity;
  this.ambientLight.color.set(ambientLightColor);
}
// 设置平行光
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
  const { x, y, z } = lightPosition(directionalHorizontal, directionalVertical, directionalSistine);
  this.directionalLight.position.set(x, y, z);
  this.directionalLightHelper.update();
}
// 设置点光源
function onSetModelPointLight(config) {
  const { pointHorizontal, pointVertical, pointDistance, pointLight, pointLightColor, pointLightIntensity, pointLightHelper } =
    config;
  this.pointLight.visible = pointLight;
  this.pointLightHelper.visible = pointLight && pointLightHelper;
  this.pointLight.intensity = pointLightIntensity;
  this.pointLight.color.set(pointLightColor);
  const { x, y, z } = lightPosition(pointHorizontal, pointVertical, pointDistance);
  this.pointLight.position.set(x, y, z);
  this.pointLightHelper.update();
}
// 设置聚光灯
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
  const { x, y, z } = lightPosition(spotHorizontal, spotVertical, spotSistine);
  this.spotLight.position.set(x, y, z);
  this.spotLightHelper.update();
}

// 重置场景灯光
function onResettingLight({ ambientLight }) {
  const config = {
    planeColor: "#939393",
    planeWidth: 7,
    planeHeight: 7,
    //环境光
    ambientLight,
    ambientLightColor: "#fff",
    ambientLightIntensity: 0.8,
    //平行光
    directionalLight: false,
    directionalLightHelper: true,
    directionalLightColor: "#1E90FF",
    directionalLightIntensity: 1,
    directionalHorizontal: -1.26,
    directionalVertical: -3.85,
    directionalSistine: 2.98,
    directionShadow: true,
    //点光源
    pointLight: false,
    pointLightHelper: true,
    pointLightColor: "#1E90FF",
    pointLightIntensity: 1,
    pointHorizontal: -4.21,
    pointVertical: -4.1,
    pointDistance: 2.53,
    //聚光灯
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
  this.onSetModelAmbientLight(config);
  this.onSetModelDirectionalLight(config);
  this.onSetModelPointLight(config);
  this.onSetModelSpotLight(config);
}

export default {
  onSetModelAmbientLight,
  onSetModelDirectionalLight,
  onSetModelPointLight,
  onSetModelSpotLight,
  onResettingLight
};
