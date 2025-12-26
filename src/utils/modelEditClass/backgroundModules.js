/**
 * @file 场景背景管理模块
 * @description 提供场景背景相关的所有操作方法，包括颜色、图片、全景图、视频等设置
 */

import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { useMeshEditStore } from "@/store/meshEditStore";

const store = useMeshEditStore();
export default class backgroundModules {
  constructor() {
    // 跟踪当前背景资源
    this.currentTexture = null;
    this.currentVideoElement = null;
    this.currentVideoUrl = null;
    this.currentBackgroundType = null; // 'color', 'image', 'panorama', 'hdr', 'video'
  }

  /**
   * 暂停视频播放
   * @private
   */
  pauseVideo() {
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
   * @param {string} [config.type] - 背景类型，用于资源跟踪
   */
  setSceneTexture(texture, config = {}) {
    const { intensity = 1, blurriness = 0, isEnvironment = false, type } = config;

    // 在设置新纹理前清理旧资源（非视频类型的纹理）
    if (type !== "video" && this.currentBackgroundType !== "video") {
      this.disposeCurrentResources();
    }

    if (texture) {
      // 跟踪当前纹理
      this.currentTexture = texture;
      this.currentBackgroundType = type || "texture";

      store.modelApi.scene.background = texture;
      store.modelApi.scene.backgroundIntensity = intensity;
      store.modelApi.scene.backgroundBlurriness = blurriness;
      if (isEnvironment) {
        store.modelApi.scene.environment = texture;
      }
    }
  }

  /**
   * 设置场景背景颜色
   * @param {string} color - 十六进制颜色值
   * @throws {Error} 设置颜色失败时抛出错误
   */
  onSetSceneColor(color) {
    try {
      // 清理旧资源
      this.disposeCurrentResources();

      store.modelApi.scene.background = new THREE.Color(color);
      this.currentBackgroundType = "color";
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
  onSetSceneImage(url) {
    try {
      const texture = new THREE.TextureLoader().load(url);
      this.setSceneTexture(texture, { type: "image" });
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
  async onSetSceneViewImage(config) {
    try {
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

      this.setSceneTexture(texture, {
        intensity,
        blurriness,
        isEnvironment: true,
        type: "panorama"
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
  onSetSceneViewConfig(config) {
    const { blurriness, intensity } = config;
    store.modelApi.scene.backgroundIntensity = intensity;
    store.modelApi.scene.backgroundBlurriness = blurriness;
  }

  /**
   * 设置外部全景图
   * @param {string} url - 图片URL
   * @param {string} type - 图片类型，支持 'hdr' 或普通图片
   * @returns {Promise<THREE.Texture>} 返回创建的纹理对象
   * @throws {Error} 设置外部贴图失败时抛出错误
   */
  async onSetStorageViewImage(url, type) {
    try {
      const loader = type === "hdr" ? new RGBELoader() : new THREE.TextureLoader();
      const texture = await loader.loadAsync(url);
      texture.mapping = THREE.EquirectangularReflectionMapping;

      this.setSceneTexture(texture, { type: type === "hdr" ? "hdr" : "panorama" });
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
  async onSetStorageViewVideo(file) {
    try {
      const { container } = store.modelApi;

      // 获取或创建视频元素
      let video = document.getElementById("video");
      if (!video) {
        video = document.createElement("video");
        video.id = "video";
        video.style.display = "none";
        video.crossOrigin = "anonymous";
        video.loop = true;
        video.muted = true; // 静音以允许自动播放
        document.body.appendChild(video);
      }

      // 清理之前的视频资源
      if (this.currentVideoUrl) {
        if (this.currentVideoUrl.startsWith("blob:")) {
          URL.revokeObjectURL(this.currentVideoUrl);
        }
      }

      // 创建视频URL
      const videoUrl = URL.createObjectURL(file.raw);
      this.currentVideoUrl = videoUrl;

      // 设置视频元素属性
      video.src = videoUrl;
      video.width = container.clientWidth;
      video.height = container.clientHeight;

      // 等待视频加载元数据
      await new Promise((resolve, reject) => {
        const onLoadedMetadata = () => {
          video.removeEventListener("loadedmetadata", onLoadedMetadata);
          resolve();
        };
        const onError = error => {
          video.removeEventListener("error", onError);
          reject(error);
        };
        video.addEventListener("loadedmetadata", onLoadedMetadata);
        video.addEventListener("error", onError);
      });

      // 创建视频纹理
      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.colorSpace = THREE.SRGBColorSpace;
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;

      // 跟踪视频资源
      this.currentVideoElement = video;

      this.setSceneTexture(videoTexture, { type: "video" });

      // 播放视频
      try {
        await video.play();
      } catch (playError) {
        console.warn("视频自动播放失败:", playError);
        // 不抛出错误，因为纹理已经设置成功
      }

      return videoTexture;
    } catch (error) {
      console.error("设置视频失败:", error);
      // 清理失败时的资源
      if (this.currentVideoUrl && this.currentVideoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(this.currentVideoUrl);
        this.currentVideoUrl = null;
      }
      throw error;
    }
  }
  /**
   * 清理当前背景资源
   * @private
   */
  disposeCurrentResources() {
    // 清理纹理资源
    if (this.currentTexture) {
      this.currentTexture.dispose();
      this.currentTexture = null;
    }

    // 清理视频资源
    if (this.currentVideoElement) {
      this.currentVideoElement.pause();
      this.currentVideoElement.src = "";
      this.currentVideoElement.load(); // 重置视频元素
      this.currentVideoElement = null;
    }

    // 清理视频URL（释放blob URL或data URL内存）
    if (this.currentVideoUrl && this.currentVideoUrl.startsWith("blob:")) {
      URL.revokeObjectURL(this.currentVideoUrl);
    }
    this.currentVideoUrl = null;

    // 重置场景背景
    if (store.modelApi?.scene) {
      store.modelApi.scene.background = null;
      store.modelApi.scene.environment = null;
      store.modelApi.scene.backgroundIntensity = 1;
      store.modelApi.scene.backgroundBlurriness = 0;
    }

    this.currentBackgroundType = null;
  }
  /**
   * 销毁背景模块，清理所有资源
   * 在组件销毁时调用此方法
   */
  dispose() {
    this.disposeCurrentResources();

    // 移除视频元素
    const video = document.getElementById("video");
    if (video && video.parentNode) {
      video.parentNode.removeChild(video);
    }
  }
}
