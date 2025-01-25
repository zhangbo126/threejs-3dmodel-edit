/**
 * sessionStorage操作对象
 */
const session = {
  /**
   * 设置sessionStorage
   * @param {String} key - 存储的键名
   * @param {Object | Array | String | Number} value - 存储的值
   * @returns {null} 当key或value无效时返回null
   */
  set: (key, value) => {
    if (!key || !value) {
      return null;
    }
    sessionStorage.setItem(key, JSON.stringify(value));
  },

  /**
   * 获取sessionStorage
   * @param {String} key - 存储的键名
   * @returns {Object | Array | String | Number | null} 返回存储的值,无效key时返回null
   */
  get: key => {
    if (!key) {
      return null;
    }
    var obj = JSON.parse(sessionStorage.getItem(key));
    return obj;
  },

  /**
   * 移除指定的sessionStorage
   * @param {String} key - 需要移除的键名
   */
  remove: key => {
    sessionStorage.removeItem(key);
  },

  /**
   * 清空所有sessionStorage
   */
  clear: () => {
    sessionStorage.clear();
  }
};

/**
 * localStorage操作对象
 */
const local = {
  /**
   * 设置localStorage
   * @param {String} key - 存储的键名
   * @param {Object | Array | String | Number} value - 存储的值
   * @returns {null} 当key或value无效时返回null
   */
  set: (key, value) => {
    if (!key || !value) {
      return null;
    }
    localStorage.setItem(key, JSON.stringify(value));
  },

  /**
   * 获取localStorage
   * @param {String} key - 存储的键名
   * @returns {Object | Array | String | Number | null} 返回存储的值,无效key时返回null
   */
  get: key => {
    if (!key) {
      return null;
    }
    var obj = JSON.parse(localStorage.getItem(key));
    return obj;
  },

  /**
   * 移除指定的localStorage
   * @param {String} key - 需要移除的键名
   */
  remove: key => {
    localStorage.removeItem(key);
  },

  /**
   * 清空所有localStorage
   */
  clear: () => {
    localStorage.clear();
  }
};

export { session, local };
