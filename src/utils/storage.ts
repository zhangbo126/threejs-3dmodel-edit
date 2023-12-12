

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

type valueOptions = any
const session = {
	set: (key: string, value: valueOptions) => {
		if (!key || !value) { return null }
		sessionStorage.setItem(key, JSON.stringify(value))
	},
	get: (key: string) => {
		if (!key) { return null }
		const storageStr: any = sessionStorage.getItem(key)
		const obj: valueOptions = JSON.parse(storageStr)
		return obj
	},
	remove: (key: string) => {
		sessionStorage.removeItem(key)
	},
	clear: () => {
		sessionStorage.clear()
	}
}

const local = {
	set: (key: string, value: valueOptions) => {
		if (!key || !value) { return null }
		localStorage.setItem(key, JSON.stringify(value))
	},
	get: (key: string) => {
		
		if (!key) { return null }
		const storageStr: any = localStorage.getItem(key)
		const obj: valueOptions = JSON.parse(storageStr)
		return obj
	},
	remove: (key: string) => {
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