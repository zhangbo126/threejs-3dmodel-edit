/**
 * @file 灯光管理模块
 * @description 提供场景中各种光源的控制方法，包括环境光、平行光、点光源、聚光灯等设置
 */

import { lightPosition } from "@/utils/utilityFunction";
import { useMeshEditStore } from "@/store/meshEditStore";
const store = useMeshEditStore();
export default class lightModules {
  /**
   * 设置环境光参数
   * @param {Object} params - 环境光配置参数
   * @param {boolean} params.ambientLight - 是否启用环境光
   * @param {string} params.ambientLightColor - 环境光颜色
   * @param {number} params.ambientLightIntensity - 环境光强度
   * @throws {Error} 设置环境光失败时抛出错误
   */
  onSetModelAmbientLight({ ambientLight, ambientLightColor, ambientLightIntensity }) {
    try {
      store.modelApi.ambientLight.visible = ambientLight;
      store.modelApi.ambientLight.intensity = ambientLightIntensity;
      store.modelApi.ambientLight.color.set(ambientLightColor);
    } catch (error) {
      console.error("设置环境光失败:", error);
      throw error;
    }
  }

  /**
   * 设置平行光参数
   * @param {Object} config - 平行光配置参数
   * @param {boolean} config.directionShadow - 是否投射阴影
   * @param {number} config.directionalHorizontal - 水平位置
   * @param {number} config.directionalVertical - 垂直位置
   * @param {number} config.directionalSistine - 距离位置
   * @param {boolean} config.directionalLight - 是否启用平行光
   * @param {string} config.directionalLightColor - 平行光颜色
   * @param {number} config.directionalLightIntensity - 平行光强度
   * @param {boolean} config.directionalLightHelper - 是否显示辅助线
   * @throws {Error} 设置平行光失败时抛出错误
   */
  onSetModelDirectionalLight(config) {
    try {
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

      store.modelApi.directionalLight.visible = directionalLight;
      store.modelApi.directionalLightHelper.visible = directionalLightHelper && directionalLight;
      store.modelApi.directionalLight.intensity = directionalLightIntensity;
      store.modelApi.directionalLight.castShadow = directionShadow;
      store.modelApi.directionalLight.color.set(directionalLightColor);

      const position = lightPosition(directionalHorizontal, directionalVertical, directionalSistine);
      store.modelApi.directionalLight.position.set(position.x, position.y, position.z);
      store.modelApi.directionalLightHelper.update();
    } catch (error) {
      console.error("设置平行光失败:", error);
      throw error;
    }
  }

  /**
   * 设置点光源参数
   * @param {Object} config - 点光源配置参数
   * @param {number} config.pointHorizontal - 水平位置
   * @param {number} config.pointVertical - 垂直位置
   * @param {number} config.pointDistance - 距离位置
   * @param {boolean} config.pointLight - 是否启用点光源
   * @param {string} config.pointLightColor - 点光源颜色
   * @param {number} config.pointLightIntensity - 点光源强度
   * @param {boolean} config.pointLightHelper - 是否显示辅助线
   * @throws {Error} 设置点光源失败时抛出错误
   */
  onSetModelPointLight(config) {
    try {
      const {
        pointHorizontal,
        pointVertical,
        pointDistance,
        pointLight,
        pointLightColor,
        pointLightIntensity,
        pointLightHelper
      } = config;
      store.modelApi.pointLight.visible = pointLight;
      store.modelApi.pointLightHelper.visible = pointLight && pointLightHelper;
      store.modelApi.pointLight.intensity = pointLightIntensity;
      store.modelApi.pointLight.color.set(pointLightColor);

      const position = lightPosition(pointHorizontal, pointVertical, pointDistance);
      store.modelApi.pointLight.position.set(position.x, position.y, position.z);
      store.modelApi.pointLightHelper.update();
    } catch (error) {
      console.error("设置点光源失败:", error);
      throw error;
    }
  }

  /**
   * 设置聚光灯参数
   * @param {Object} config - 聚光灯配置参数
   * @param {number} config.spotDistance - 照射距离
   * @param {boolean} config.spotCastShadow - 是否投射阴影
   * @param {boolean} config.spotLightHelper - 是否显示辅助线
   * @param {number} config.spotFocus - 阴影焦点
   * @param {number} config.spotPenumbra - 半影
   * @param {number} config.spotAngle - 照射角度
   * @param {boolean} config.spotLight - 是否启用聚光灯
   * @param {string} config.spotLightColor - 聚光灯颜色
   * @param {number} config.spotLightIntensity - 聚光灯强度
   * @param {number} config.spotHorizontal - 水平位置
   * @param {number} config.spotVertical - 垂直位置
   * @param {number} config.spotSistine - 距离位置
   * @throws {Error} 设置聚光灯失败时抛出错误
   */
  onSetModelSpotLight(config) {
    try {
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
      store.modelApi.spotLight.visible = spotLight;
      store.modelApi.spotLightHelper.visible = spotLight && spotLightHelper;
      store.modelApi.spotLight.intensity = spotLightIntensity;
      store.modelApi.spotLight.angle = spotAngle;
      store.modelApi.spotLight.penumbra = spotPenumbra;
      store.modelApi.spotLight.shadow.focus = spotFocus;
      store.modelApi.spotLight.castShadow = spotCastShadow;
      store.modelApi.spotLight.distance = spotDistance;
      store.modelApi.spotLight.color.set(spotLightColor);

      const position = lightPosition(spotHorizontal, spotVertical, spotSistine);
      store.modelApi.spotLight.position.set(position.x, position.y, position.z);
      store.modelApi.spotLightHelper.update();
    } catch (error) {
      console.error("设置聚光灯失败:", error);
      throw error;
    }
  }

  /**
   * 重置所有光源到默认状态
   * @param {Object} params - 重置参数
   * @param {boolean} params.ambientLight - 是否启用环境光
   * @throws {Error} 重置光源失败时抛出错误
   */
  onResettingLight({ ambientLight }) {
    try {
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
    } catch (error) {
      console.error("重置光源失败:", error);
      throw error;
    }
  }
}
