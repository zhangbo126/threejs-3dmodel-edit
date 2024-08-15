
/**
 * @describe 辅助线/轴配置模块方法
 * @function onSetModelRotateOnAxis 设置模型轴旋转
 * @function onResultModelRotateOnAxis 重置模型轴位置
 * @function onSetModelPosition 设置模型位置
 * @function onResultModelPosition 重置模型位置
 * @function onResetModelCamera 重置相机位置
 * @function onGetModelCamera 获取相机位置
 * @function onSetModelGridHelper 设置网格辅助线位置和颜色
 * @function onSetModelGridHelperSize 设置网格数量和大小
 * @function onSetModelAxesHelper 设置坐标轴辅助线
 */
import * as THREE from 'three'
import TWEEN from "@tweenjs/tween.js";


// 设置模型轴旋转
function onSetModelRotateOnAxis(type, flag) {
	const maxAxis = Math.PI / 2
	const { x, y, z } = this.model.rotation
	const endPosition = {
		x, y, z
	}
	endPosition[type] += flag ? maxAxis : -maxAxis
	const Tween = new TWEEN.Tween({ x, y, z })
	Tween.to(endPosition, 500)
	Tween.onUpdate((val) => {
		this.model.rotation[type] = val[type]
	})
	Tween.start();
}
// 重置模型轴位置
function onResultModelRotateOnAxis() {
	this.model.rotation.x = 0
	this.model.rotation.y = 0
	this.model.rotation.z = 0
}
// 设置模型位置
function onSetModelPosition({ positionX, positionY, positionZ }) {
	const Tween = new TWEEN.Tween(this.model.position)
	const endPosition = {
		x: positionX,
		y: positionY,
		z: positionZ
	}
	Tween.to(endPosition, 500)
	Tween.onUpdate((val) => {
		this.model.position.set(val.x || 0, val.y || 0, val.z || 0)
	})
	Tween.start();
}
// 重置模型位置
function onResultModelPosition({ positionX, positionY, positionZ }) {
	this.model.position.set(positionX, positionY, positionZ)
}
// 重置相机位置
function onResetModelCamera() {
	// 设置相机位置
	this.camera.position.set(0, 2, 6)
	// 设置相机坐标系
	this.camera.lookAt(0, 0, 0)
}
// 获取相机位置
function onGetModelCamera() {
	return this.camera.position
}
// 设置网格辅助线位置和颜色
function onSetModelGridHelper({ x, y, z, gridHelper, color }) {
	this.gridHelper.visible = gridHelper
	this.gridHelper.material.color.set(color);

	const Tween = new TWEEN.Tween(this.gridHelper.position)
	const endPosition = {
		x, y, z
	}
	Tween.to(endPosition, 500)
	Tween.onUpdate((val) => {
		this.gridHelper.position.set(val.x || 0, val.y || 0, val.z || 0)
	})
	Tween.start();
}
// 设置网格数量和大小
function onSetModelGridHelperSize({ x, y, z, size, divisions, color, gridHelper }) {
	// 需要先把辅助线移除然后在重新创建
	this.scene.remove(this.gridHelper)
	this.gridHelper.geometry.dispose()
	this.gridHelper.material.dispose()
	this.gridHelper = new THREE.GridHelper(size, divisions, color, color);
	this.gridHelper.position.set(x, y, z)
	this.gridHelper.material.linewidth = 0.1
	this.gridHelper.material.color.set(color);
	this.gridHelper.visible = gridHelper
	this.scene.add(this.gridHelper)
}
// 设置坐标轴辅助线
function onSetModelAxesHelper({ axesHelper, axesSize }) {
	// 需要先把辅助线移除然后在重新创建
	this.scene.remove(this.axesHelper)
	this.axesHelper.geometry.dispose()
	this.axesHelper.material.dispose()
	this.axesHelper = new THREE.AxesHelper(axesSize);
	this.axesHelper.position.set(0, -.50, 0)
	this.axesHelper.visible = axesHelper
	this.scene.add(this.axesHelper);
}

export default {
	onSetModelRotateOnAxis,
	onResultModelRotateOnAxis,
	onSetModelPosition,
	onResultModelPosition,
	onResetModelCamera,
	onGetModelCamera,
	onSetModelGridHelper,
	onSetModelGridHelperSize,
	onSetModelAxesHelper
}