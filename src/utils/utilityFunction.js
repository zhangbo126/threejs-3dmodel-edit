
/**
 * 节流原理：在一定时间内，只能触发一次
 *
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
export function throttle(func, wait = 500, immediate = false) {
	let timer; let
		flag
	if (immediate) {
		if (!flag) {
			flag = true
			// 如果是立即执行，则在wait毫秒内开始时执行
			typeof func === 'function' && func()
			timer = setTimeout(() => {
				flag = false
			}, wait)
		}
	} else if (!flag) {
		flag = true
		// 如果是非立即执行，则在wait毫秒内的结束处执行
		timer = setTimeout(() => {
			flag = false
			typeof func === 'function' && func()
		}, wait)
	}
}



/**
 * 防抖原理：一定时间内，只有最后一次操作，再过wait毫秒后才执行函数
 *
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */

export function debounce(func, wait = 500, immediate = false) {
	let timeout = null
	// 清除定时器
	if (timeout !== null) clearTimeout(timeout)
	// 立即执行，此类情况一般用不到
	if (immediate) {
		const callNow = !timeout
		timeout = setTimeout(() => {
			timeout = null
		}, wait)
		if (callNow) typeof func === 'function' && func()
	} else {
		// 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
		timeout = setTimeout(() => {
			typeof func === 'function' && func()
		}, wait)
	}
}


/**
 * 计算光源垂直和水平方向的定位
 *
 * @param {Number} horizontal 水平方向值
 * @param {Number} vertical  垂直方向值
 * @param {Number} distance  光源距离
 * @return {x , y , z}  返回光源坐标轴位置
 */

export function lightPosition(horizontal, vertical, distance) {
	const x = distance * Math.sin(horizontal) * Math.cos(vertical);
	const y = distance * Math.sin(vertical);
	const z = distance * Math.cos(horizontal) * Math.cos(vertical);
	return {x,y,z}
}



/** 
 * @description 生成唯一标识符方法函数
 * @param {Number} len  长度
 * @param {Number} radix  基数
 * @return {String} 唯一标识符字符串
*/

export function onlyKey(len, radix) {
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	var uuid = [], i;
	radix = radix || chars.length;
	if (len) {
		for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
	} else {
		var r;
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';
		for (i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random() * 16;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}
	return uuid.join('');
}

/** 
   @description 对象数组深拷贝方法 函数
  * @param {Array | Object} source  需要拷贝的数据源
  * @return {Array | Object}  拷贝后的新值
*/

export function deepCopy(source) {
	if (typeof source !== 'object' || source == null) {
		return source;
	}
	const target = Array.isArray(source) ? [] : {};
	for (const key in source) {
		// 检查属性是否存在对象中
		if (Object.hasOwn(source, key)) {
			if (typeof source[key] === 'object' && source[key] !== null) {
				target[key] = deepCopy(source[key]);
			} else {
				target[key] = source[key];
			}
		}
	}
	return target;
}
