/**
	 * @describe 材质模块方法
	 * @function chooseManyModel 选择当前模型
	 * @function deleteManyModel 删除当前模型
	 * @function setManyModelRotation 修改当前模型轴位置
	 * @function initManyModelRotation 重置模型轴位置
	 * @function setManyModelPosition 修改当前模型位置
	 * @function initManyModelPosition 重置模型位置
	 * @function setManyModelScale 设置模型位置

 */
import * as THREE from 'three'
import TWEEN from "@tweenjs/tween.js";


function chooseManyModel(uuid) {
	const manyModel = this.scene.getObjectByProperty('uuid', uuid)
	this.outlinePass.visibleEdgeColor = new THREE.Color('#409eff') // 可见边缘的颜色
	this.outlinePass.hiddenEdgeColor = new THREE.Color('#0099cc') // 不可见边缘的颜色
	this.outlinePass.selectedObjects = [manyModel]
	// console.log(manyModel, '===============')
	if (manyModel) {
		const { position, rotation, userData, scale } = manyModel.clone()
		manyModel.userData = {
			...userData,
			position,
			rotation,
			scale
		}
		return {
			position: { ...position },
			rotation: { ...rotation },
			scale: scale.x
		}
	}
	return {}
}

function deleteManyModel(uuid) {
	const manyModel = this.scene.getObjectByProperty('uuid', uuid)
	if (!manyModel) return

	this.manyModelGroup.remove(manyModel)
	this.outlinePass.selectedObjects = []
}

function setManyModelRotation(type, flag, uuid) {
	const manyModel = this.scene.getObjectByProperty('uuid', uuid)
	if (!manyModel) return

	const maxAxis = Math.PI / 2
	const { x, y, z } = manyModel.rotation
	const endPosition = {
		x, y, z
	}
	endPosition[type] += flag ? maxAxis : -maxAxis
	const Tween = new TWEEN.Tween({ x, y, z })
	Tween.to(endPosition, 500)
	Tween.onUpdate((val) => {
		manyModel.rotation[type] = val[type]
	})
	Tween.start();
}

function initManyModelRotation(uuid) {
	const manyModel = this.scene.getObjectByProperty('uuid', uuid)
	if (!manyModel) return

	const { userData: { rotation } } = manyModel
	manyModel.rotation.set(rotation.x, rotation.y, rotation.z)
}


function setManyModelPosition(position, uuid) {
	const manyModel = this.scene.getObjectByProperty('uuid', uuid)
	if (!manyModel) return

	const Tween = new TWEEN.Tween(manyModel.position)
	const endPosition = {
		x: position.x,
		y: position.y,
		z: position.z
	}
	Tween.to(endPosition, 500)
	Tween.onUpdate((val) => {
		manyModel.position.set(val.x || 0, val.y || 0, val.z || 0)
	})
	Tween.start();
}

function initManyModelPosition(uuid) {
	const manyModel = this.scene.getObjectByProperty('uuid', uuid)
	const { userData: { position } } = manyModel
	manyModel.position.set(position.x || 0, position.y || 0, position.z || 0)
	return {
		...position
	}
}

function setManyModelScale(uuid, scale) {
	const manyModel = this.scene.getObjectByProperty('uuid', uuid)
	if (!manyModel) return
	const Tween = new TWEEN.Tween(manyModel.scale)
	const endPosition = {
		x: scale,
		y: scale,
		z: scale
	}
	Tween.to(endPosition, 500)
	Tween.onUpdate((val) => {
		manyModel.scale.set(val.x || 0, val.y || 0, val.z || 0)
	})
	Tween.start();
}



export default {
	chooseManyModel,
	deleteManyModel,
	setManyModelRotation,
	initManyModelRotation,
	setManyModelPosition,
	initManyModelPosition,
	setManyModelScale
}