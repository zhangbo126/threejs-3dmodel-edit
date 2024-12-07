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
