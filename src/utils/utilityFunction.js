import * as THREE from "three";
import { useMeshEditStore } from "@/store/meshEditStore";

/**
 * 节流函数 - 在一定时间内只能触发一次
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延时时间(ms)
 * @param {Boolean} immediate 是否立即执行
 * @return {Function} 节流后的函数
 */
export function throttle(func, wait = 500, immediate = false) {
  let timer = null;
  let flag = false;

  return function (...args) {
    if (immediate) {
      if (!flag) {
        flag = true;
        typeof func === "function" && func.apply(this, args);
        timer = setTimeout(() => (flag = false), wait);
      }
    } else if (!flag) {
      flag = true;
      timer = setTimeout(() => {
        flag = false;
        typeof func === "function" && func.apply(this, args);
      }, wait);
    }
  };
}

/**
 * 防抖函数 - 一定时间内只执行最后一次操作
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延时时间(ms)
 * @param {Boolean} immediate 是否立即执行
 * @return {Function} 防抖后的函数
 */
export function debounce(func, wait = 500, immediate = false) {
  let timer = null;

  return function (...args) {
    const callNow = immediate && !timer;

    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      timer = null;
      if (!immediate) {
        typeof func === "function" && func.apply(this, args);
      }
    }, wait);

    if (callNow) {
      typeof func === "function" && func.apply(this, args);
    }
  };
}

/**
 * 计算光源位置坐标
 * @param {Number} horizontal 水平方向角度(弧度)
 * @param {Number} vertical 垂直方向角度(弧度)
 * @param {Number} distance 光源距离
 * @return {{x: Number, y: Number, z: Number}} 光源坐标
 */
export function lightPosition(horizontal, vertical, distance) {
  return {
    x: distance * Math.sin(horizontal) * Math.cos(vertical),
    y: distance * Math.sin(vertical),
    z: distance * Math.cos(horizontal) * Math.cos(vertical)
  };
}

/**
 * 生成唯一标识符
 * @param {Number} len 长度
 * @param {Number} radix 基数
 * @return {String} 唯一标识符
 */
export function onlyKey(len, radix) {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const uuid = [];
  radix = radix || chars.length;

  if (len) {
    for (let i = 0; i < len; i++) {
      uuid[i] = chars[Math.floor(Math.random() * radix)];
    }
  } else {
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        const r = Math.floor(Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join("");
}

/**
 * 深拷贝函数
 * @param {Array|Object} source 源数据
 * @return {Array|Object} 深拷贝后的数据
 */
export function deepCopy(source) {
  if (!source || typeof source !== "object") {
    return source;
  }

  const target = Array.isArray(source) ? [] : {};

  for (const key in source) {
    if (Object.hasOwn(source, key)) {
      target[key] = typeof source[key] === "object" && source[key] !== null ? deepCopy(source[key]) : source[key];
    }
  }

  return target;
}

/**
 * 获取文件扩展名
 * @param {String} fileName 文件名
 * @return {String} 文件扩展名(小写)
 */
export function getFileType(fileName) {
  return fileName.split(".").pop().toLowerCase();
}

/**
 * 获取assets目录下的资源文件路径
 * @param {String} filePath 相对路径
 * @return {String} 完整文件路径
 */
export function getAssetsFile(filePath) {
  return new URL(`../assets/${filePath}`, import.meta.url).href;
}

/**
 * 查找场景中的指定对象
 * @param {THREE.Scene} scene - Three.js 场景
 * @param {Object} options - 查找选项
 * @param {Function} [options.type] - 按类型查找，例如 TransformControls
 * @returns {THREE.Object3D|null} 找到的对象，如果没找到则返回 null
 */
export function findObjectInScene(scene, { type }) {
  let found = null;

  scene.traverse(object => {
    if (type && object.type === type) {
      found = object;
    }
  });

  return found;
}

/**
 * 获取鼠标在3D场景中的位置
 * @param {number} clientX - 鼠标X坐标
 * @param {number} clientY - 鼠标Y坐标
 * @returns {THREE.Vector3 | null} - 返回3D坐标位置，如果未找到则返回null
 */
export const getMousePosition = (clientX, clientY) => {
  const store = useMeshEditStore();
  if (!store.modelApi || !store.modelApi.scene || !store.modelApi.camera || !store.modelApi.container) {
    return null;
  }

  const { scene, camera, container } = store.modelApi;
  const { clientHeight, clientWidth, offsetLeft, offsetTop } = container;

  // 计算鼠标在屏幕上的标准化坐标 (-1 到 1)
  const mouse = new THREE.Vector2();
  mouse.x = ((clientX - offsetLeft) / clientWidth) * 2 - 1;
  mouse.y = -((clientY - offsetTop) / clientHeight) * 2 + 1;

  // 创建射线投射器
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  // 与场景中的所有对象进行射线检测
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    // 返回第一个相交点的3D坐标
    return intersects[0].point;
  }

  // 如果没有相交，返回射线与Y=0平面的交点作为默认值
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const intersectionPoint = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, intersectionPoint);

  return intersectionPoint;
};

/**
 * 获取场景中所有shader类型的材质
 * @param {THREE.Scene} [scene] - Three.js场景对象，如果不传则使用store中的场景
 * @returns {Array} - 返回shader材质列表，格式：[{name: '材质名称', uuid: '材质UUID'}]
 */
export const getShaderMaterials = (scene) => {
  const store = useMeshEditStore();
  const targetScene = scene || store.modelApi?.scene;
  
  if (!targetScene) {
    console.warn('场景对象不存在');
    return [];
  }

  const shaderMaterials = [];

  targetScene.traverse(object => {
    if (object instanceof THREE.Mesh && 
        object.userData?.type === 'Shader' && 
        object.material) {
      shaderMaterials.push({
        name: object.name || '未命名Shader',
        onlyUuid: object.userData.onlyUuid,
        uuid: object.uuid
      });
    }
  });

  return shaderMaterials;
};

