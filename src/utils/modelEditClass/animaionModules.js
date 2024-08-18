/**
	 * @describe 模型动画模块方法
	 * @function onStartModelAnimaion 开始执行动画
	 * @function onSetModelAnimaion 设置模型动画
	 * @function animationFrameFun 动画帧
	 * @function onClearAnimation 清除动画
	 * @function onSetRotation 设置模型轴动画
	 * @function onSetRotationType 设置模型轴动画类型
	 * @function getModelAnimaionList 获取当前模型动画列表
 */

import * as THREE from 'three'


// 开始执行动画
function onStartModelAnimaion(config) {
	this.onSetModelAnimaion(config)
	cancelAnimationFrame(this.animationFrame)
	this.animationFrameFun()
}
// 设置模型动画
function onSetModelAnimaion({ animationName, loop, timeScale, weight }) {
	this.animationMixer = new THREE.AnimationMixer(this.model)
	const clip = THREE.AnimationClip.findByName(this.modelAnimation, animationName)
	if (clip) {
		this.animateClipAction = this.animationMixer.clipAction(clip)
		this.animateClipAction.setEffectiveTimeScale(timeScale)
		this.animateClipAction.setEffectiveWeight(weight)
		this.animateClipAction.setLoop(this.loopMap[loop])
		this.animateClipAction.play()
	}
}
// 动画帧
function animationFrameFun() {
	this.animationFrame = requestAnimationFrame(() => this.animationFrameFun())
	if (this.animationMixer) {
		this.animationMixer.update(this.animationClock.getDelta())
	}
}
// 清除动画
function onClearAnimation() {
	if (!this.animateClipAction) return
	this.animationMixer.stopAllAction();
	this.animationMixer.update(0);
	cancelAnimationFrame(this.animationFrame)
}
// 设置模型轴动画
function onSetRotation(config) {
	const { rotationVisible, rotationType, rotationSpeed } = config
	if (rotationVisible) {
		cancelAnimationFrame(this.rotationAnimationFrame)
		this.rotationAnimationFun(rotationType, rotationSpeed)
	} else {
		cancelAnimationFrame(this.rotationAnimationFrame)
		this.model.rotation.set(0, 0, 0)
	}
}
// 设置轴动画类型
function onSetRotationType(config) {
	const { rotationType, rotationSpeed } = config
	this.model.rotation.set(0, 0, 0)
	cancelAnimationFrame(this.rotationAnimationFrame)
	this.rotationAnimationFun(rotationType, rotationSpeed)
}
// 轴动画帧
function rotationAnimationFun(rotationType, rotationSpeed) {
	this.rotationAnimationFrame = requestAnimationFrame(() => this.rotationAnimationFun(rotationType, rotationSpeed))
	this.model.rotation[rotationType] += rotationSpeed / 50
}

//获取当前模型动画
function getModelAnimaionList(result) {
	this.modelAnimation = result.animations || []
}

// 获取多模型动画
function getManyModelAnimationList(animations) {
	if (Array.isArray(animations)) {
		this.modelAnimation = this.modelAnimation.concat(animations)
	}
}

export default {
	onStartModelAnimaion,
	onSetModelAnimaion,
	animationFrameFun,
	onClearAnimation,
	onSetRotation,
	onSetRotationType,
	rotationAnimationFun,
	getModelAnimaionList,
	getManyModelAnimationList
}