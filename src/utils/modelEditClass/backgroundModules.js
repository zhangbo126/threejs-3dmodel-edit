/**
 * @file 场景背景管理模块
 * @description 提供场景背景相关的所有操作方法，包括颜色、图片、全景图、视频等设置
 */

import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

/**
 * 暂停视频播放
 * @private
 */
function pauseVideo() {
  const video = document.getElementById("video");
  if (video) video.pause();
}

/**
 * 设置场景纹理的通用方法
 * @private
 * @param {THREE.Texture} texture - 要设置的纹理对象
 * @param {Object} config - 纹理配置参数
 * @param {number} [config.intensity=1] - 背景强度
 * @param {number} [config.blurriness=0] - 背景模糊度
 * @param {boolean} [config.isEnvironment=false] - 是否设置为环境贴图
 */
function setSceneTexture(texture, config = {}) {
  const { intensity = 1, blurriness = 0, isEnvironment = false } = config;
  if (texture) {
    this.scene.background = texture;
    this.scene.backgroundIntensity = intensity;
    this.scene.backgroundBlurriness = blurriness;
    if (isEnvironment) {
      this.scene.environment = texture;
    }
  }
}

/**
 * 设置场景背景颜色
 * @param {string} color - 十六进制颜色值
 * @throws {Error} 设置颜色失败时抛出错误
 */
function onSetSceneColor(color) {
  try {
    pauseVideo();
    this.scene.background = new THREE.Color(color);
  } catch (error) {
    console.error("设置场景颜色失败:", error);
    throw error;
  }
}

/**
 * 设置场景背景图片
 * @param {string} url - 图片URL
 * @returns {THREE.Texture} 返回创建的纹理对象
 * @throws {Error} 设置图片失败时抛出错误
 */
function onSetSceneImage(url) {
  try {
    pauseVideo();
    const texture = new THREE.TextureLoader().load(url);
    setSceneTexture.call(this, texture);
    return texture;
  } catch (error) {
    console.error("设置场景图片失败:", error);
    throw error;
  }
}

/**
 * 设置场景全景图
 * @param {Object} config - 全景图配置
 * @param {string} config.viewImg - 全景图URL
 * @param {number} [config.blurriness=0] - 模糊度
 * @param {number} [config.intensity=1] - 强度
 * @returns {Promise<THREE.Texture>} 返回创建的纹理对象
 * @throws {Error} 设置全景图失败时抛出错误
 */
async function onSetSceneViewImage(config) {
  try {
    pauseVideo();
    const { blurriness = 0, intensity = 1, viewImg } = config;

    const texture = await new Promise((resolve, reject) => {
      new THREE.TextureLoader().load(
        viewImg,
        texture => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          resolve(texture);
        },
        undefined,
        reject
      );
    });

    setSceneTexture.call(this, texture, {
      intensity,
      blurriness,
      isEnvironment: true
    });

    return texture;
  } catch (error) {
    console.error("设置全景图失败:", error);
    throw error;
  }
}

/**
 * 更新全景图配置参数
 * @param {Object} config - 配置参数
 * @param {number} [config.blurriness] - 模糊度
 * @param {number} [config.intensity] - 强度
 */
function onSetSceneViewConfig(config) {
  const { blurriness, intensity } = config;
  this.scene.backgroundIntensity = intensity;
  this.scene.backgroundBlurriness = blurriness;
}

/**
 * 设置外部全景图
 * @param {string} url - 图片URL
 * @param {string} type - 图片类型，支持 'hdr' 或普通图片
 * @returns {Promise<THREE.Texture>} 返回创建的纹理对象
 * @throws {Error} 设置外部贴图失败时抛出错误
 */
async function onSetStorageViewImage(url, type) {
  try {
    pauseVideo();
    const loader = type === "hdr" ? new RGBELoader() : new THREE.TextureLoader();
    const texture = await loader.loadAsync(url);
    texture.mapping = THREE.EquirectangularReflectionMapping;

    setSceneTexture.call(this, texture);
    return texture;
  } catch (error) {
    console.error("设置外部贴图失败:", error);
    throw error;
  }
}

/**
 * 设置视频背景
 * @param {File} file - 视频文件对象
 * @returns {Promise<THREE.VideoTexture>} 返回创建的视频纹理对象
 * @throws {Error} 设置视频失败时抛出错误
 */
async function onSetStorageViewVideo(file) {
  try {
    const { container } = this;
    const video = document.getElementById("video");

    const videoUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file.raw);
    });

    // 设置视频元素属性
    video.src = videoUrl;
    video.width = container.clientWidth;
    video.height = container.clientHeight;

    // 创建视频纹理
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    setSceneTexture.call(this, videoTexture);
    video.play();

    return videoTexture;
  } catch (error) {
    console.error("设置视频失败:", error);
    throw error;
  }
}

export default {
  onSetSceneColor,
  onSetSceneImage,
  onSetSceneViewImage,
  onSetSceneViewConfig,
  onSetStorageViewImage,
  onSetStorageViewVideo
};
