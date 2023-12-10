
/** 
 * @description storage 封装方法ts接口类
*/
export type StorageType = {
	clear: Function;
	get: Function;
	set: Function;
	remove: Function;
}

/** 
 * @description $bus 封装方法ts接口类
*/
export type BusType = {
	all:Map<string, number>;
	emit: Function;
	off: Function;
	on: Function;
}