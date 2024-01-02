/**
	 * @describe 后期/操作模块方法
	 * @function onSetUnrealBloomPass 设置辉光效果
	 * @function setModelMeshDecompose 模型拆分
	 * @function setModelMeshDrag 模型材质可拖拽
	 * @function getMeshDragPosition 获取模型材质位拖拽置
	 * @function onSetFlowColor 修改辉光颜色
	 * @function initStageFlow 重置数据
*/

import * as THREE from 'three'
import TWEEN from "@tweenjs/tween.js";
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { MODEL_DECOMPOSE } from '@/config/constant.js'
// 设置辉光效果
function onSetUnrealBloomPass(config) {
	const { glow, threshold, strength, radius, toneMappingExposure, color } = config
	this.glowUnrealBloomPass = glow
	if (glow) {
		this.unrealBloomPass.threshold = threshold
		this.unrealBloomPass.strength = strength
		this.unrealBloomPass.radius = radius
		this.renderer.toneMappingExposure = toneMappingExposure
		this.shaderPass.material.uniforms.glowColor.value = new THREE.Color(color)
		const passesArray = this.effectComposer.passes || []
		const shaderColor = passesArray.find(v=>v.name=='ShaderColor') || {}
		if(!shaderColor.name){
	    	this.effectComposer.addPass(this.shaderPass)  
		}
		
		
	} else {
		this.unrealBloomPass.threshold = 0
		this.unrealBloomPass.strength = 0
		this.unrealBloomPass.radius = 0
		this.renderer.toneMappingExposure = toneMappingExposure
		this.shaderPass.material.uniforms.glowColor.value = new THREE.Color()
		this.glowComposer.renderer.clear()
		this.glowComposer.renderer.dispose()
		this.effectComposer.removePass(this.shaderPass)

	}
}
// 模型拆分
function setModelMeshDecompose({ decompose }) {
	if (this.glowMaterialList.length <= 1) return false
	const modelDecomposeMove = (obj, position) => {
		const Tween = new TWEEN.Tween(obj.position)
		Tween.to(position, 500)
		Tween.onUpdate(function (val) {
			obj.position.set(val.x || 0, val.y || 0, val.z || 0);
		})
		Tween.start()
	}
	const length = this.glowMaterialList.length
	const angleStep = (2 * Math.PI) / length;
	this.glowMaterialList.forEach((name, i) => {
		const mesh = this.model.getObjectByName(name)
		const { decomposeName } = this.model
		if (mesh.type == 'Mesh') {
			// 如果当前模型有设置模型分解的自定义参数
			if (MODEL_DECOMPOSE[decomposeName] && MODEL_DECOMPOSE[decomposeName][name]) {
				const position = { x: 0, y: 0, z: 0 }
				const { x: modelX, y: modelY, z: modelZ } = MODEL_DECOMPOSE[decomposeName][name]
				if (modelX == 'straight') {
					position.x += decompose
				} else if (modelX == 'burden') {
					position.x -= decompose
				}
				if (modelY == 'straight') {
					position.y += decompose
				} else if (modelY == 'burden') {
					position.y -= decompose
				}
				if (modelZ == 'straight') {
					position.z += decompose
				} else if (modelZ == 'burden') {
					position.z -= decompose
				}
				modelDecomposeMove(mesh, position)
			} else {
				// 材质位置计算
				const angle = i * angleStep;
				const x = (decompose) * Math.cos(angle);
				const y = (decompose) * Math.sin(angle);
				const position = {
					x, y, z: 0
				}

				modelDecomposeMove(mesh, position)
			}
		}
	})
}
// 模型材质可拖拽
function setModelMeshDrag({ manageFlage }) {
	if (manageFlage) {
		if (!this.transformControls) {
			this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
			this.transformControls.setMode('translate')
			this.transformControls.addEventListener('dragging-changed', (event) => {
				this.controls.enabled = !event.value;
			})
			this.transformControls.size = 1
			this.scene.add(this.transformControls)
		}
		this.transformControls.attach()
	} else {
		if (this.transformControls) {
			this.transformControls.detach()
			this.transformControls.dispose()
			this.scene.remove(this.transformControls)
			this.transformControls = null
		}
	}
}
// 设置控制器类型
function setTransformControlsType(type) {
	this.transformControls.setMode(type)
}


// 获取模型材质位拖拽置
function getMeshDragPosition() {
	const positonList = []
	this.modelMaterialList.forEach(v => {
		const mesh = this.model.getObjectByProperty('name', v.name)
		const { rotation, scale, position } = mesh
		const obj = {
			name: v.name,
			rotation: {
				x: rotation.x,
				y: rotation.y,
				z: rotation.z,
			},
			scale: {
				x: scale.x,
				y: scale.y,
				z: scale.z,
			},
			position: {
				x: position.x,
				y: position.y,
				z: position.z,
			},
		}
		positonList.push(obj)
	})
	return positonList
}
// 修改辉光颜色
function onSetFlowColor(color) {
	this.shaderPass.material.uniforms.glowColor.value = new THREE.Color(color)
}

function initStageFlow() {
	this.renderer.toneMappingExposure = 2
	Object.assign(this.unrealBloomPass, {
		threshold: 0,
		strength: 0,
		radius: 0,
	})
	this.shaderPass.material.uniforms.glowColor.value = new THREE.Color()
	this.glowUnrealBloomPass = false
	this.glowComposer.renderer.clear()
	this.glowComposer.renderer.dispose()
	if (this.transformControls) {
		this.transformControls.detach()
		this.transformControls.dispose()
		this.scene.remove(this.transformControls)
		this.transformControls = null
	}
	this.effectComposer.removePass(this.shaderPass)
	this.model.traverse((v) => {
		if (v.isMesh && v.material) {
			const { rotation, scale, position } = v.userData
			v.rotation.set(rotation.x, rotation.y, rotation.z)
			v.scale.set(scale.x, scale.y, scale.z)
			v.position.set(position.x, position.y, position.z)
		}
	})
}

export default {
	onSetUnrealBloomPass,
	setModelMeshDecompose,
	setModelMeshDrag,
	getMeshDragPosition,
	onSetFlowColor,
	initStageFlow,
	setTransformControlsType
}