

/**
 * @function clear
   @description 清除所有存储 sessionStorage | localStorage
 *
 * @function set
   @description 设置存储 sessionStorage | localStorage
   @param {Object | Array | String | Number} value value
   @param {String} key
   @return {Object | Array | String | Number}
 *
 *  @function get
 *  @description 获取存储 sessionStorage | localStorage
 *  @param {String} key
 *
 * @function remove
   @description 清除存储 sessionStorage | localStorage
   @param {String} key
*/

const session = {
	set: (key, value) => {
		if (!key || !value) { return null }
		sessionStorage.setItem(key, JSON.stringify(value))
	},
	get: (key) => {
		if (!key) { return null }
		var obj = JSON.parse(sessionStorage.getItem(key))
		return obj
	},
	remove: (key) => {
		sessionStorage.removeItem(key)

	},
	clear: () => {
		sessionStorage.clear()
	}
}

const local = {
	set: (key, value) => {
		if (!key || !value) { return null }
		localStorage.setItem(key, JSON.stringify(value))
	},
	get: (key) => {
		if (!key) { return null }
		var obj = JSON.parse(localStorage.getItem(key))
		return obj
	},
	remove: (key) => {
		localStorage.removeItem(key)

	},
	clear: () => {
		localStorage.clear()
	}
}




export {
	session,
	local
}