
/**
 * @describe 后期/操作模块方法
 * @function onSetUnrealBloomPass 设置辉光效果
 * @function setModelMeshDecompose 模型拆分
 * @function setModelMeshDrag 模型材质可拖拽
 * @function getMeshDragPosition 获取模型材质位拖拽置
 * @function onSetFlowColor 修改辉光颜色
 */

import * as THREE from 'three' //导入整个 three.js核心库
import TWEEN from "@tweenjs/tween.js";

// 设置辉光效果
// const onSetUnrealBloomPass = (config: { glow: any; threshold: any; strength: any; radius: any; toneMappingExposure: any, color: string }) => {
// 	const { glow, threshold, strength, radius, toneMappingExposure, color } = config
// 	this.glowUnrealBloomPass = glow
// 	if (glow) {
// 		this.unrealBloomPass.threshold = threshold
// 		this.unrealBloomPass.strength = strength
// 		this.unrealBloomPass.radius = radius
// 		this.renderer.toneMappingExposure = toneMappingExposure
// 		this.shaderPass.material.uniforms.glowColor.value = new THREE.Color(color)

// 	} else {
// 		this.unrealBloomPass.threshold = 0
// 		this.unrealBloomPass.strength = 0
// 		this.unrealBloomPass.radius = 0
// 		this.renderer.toneMappingExposure = toneMappingExposure
// 		this.shaderPass.material.uniforms.glowColor.value = new THREE.Color()
// 	}
// }
// // 模型拆分
// setModelMeshDecompose(meshDecompose: { decompose: number }) {
// 	const { decompose } = meshDecompose
// 	if (this.glowMaterialList.length <= 1) return false
// 	const modelDecomposeMove = (obj: any, position: { [x: string]: any }) => {
// 		const Tween = new TWEEN.Tween(obj.position)
// 		Tween.to(position, 500)
// 		Tween.onUpdate(function (val) {
// 			obj.position.set(val.x || 0, val.y || 0, val.z || 0);
// 		})
// 		Tween.start()
// 	}
// 	const length = this.glowMaterialList.length
// 	const angleStep = (2 * Math.PI) / length;
// 	this.glowMaterialList.forEach((name: string | number, i: number) => {
// 		const mesh = this.model.getObjectByName(name)
// 		const { decomposeName } = this.model
// 		if (mesh.type == 'Mesh') {
// 			// 如果当前模型有设置模型分解的自定义参数
// 			if ((MODEL_DECOMPOSE as any)[decomposeName] && (MODEL_DECOMPOSE as any)[decomposeName][name]) {
// 				const position = { x: 0, y: 0, z: 0 }
// 				const { x: modelX, y: modelY, z: modelZ } = (MODEL_DECOMPOSE as any)[decomposeName][name]
// 				if (modelX == 'straight') {
// 					position.x += decompose
// 				} else if (modelX == 'burden') {
// 					position.x -= decompose
// 				}
// 				if (modelY == 'straight') {
// 					position.y += decompose
// 				} else if (modelY == 'burden') {
// 					position.y -= decompose
// 				}
// 				if (modelZ == 'straight') {
// 					position.z += decompose
// 				} else if (modelZ == 'burden') {
// 					position.z -= decompose
// 				}
// 				modelDecomposeMove(mesh, position)
// 			} else {
// 				// 材质位置计算
// 				const angle = i * angleStep;
// 				const x = (decompose) * Math.cos(angle);
// 				const y = (decompose) * Math.sin(angle);
// 				const position = {
// 					x, y, z: 0
// 				}
// 				modelDecomposeMove(mesh, position)
// 			}
// 		}
// 	})
// }
// // 模型材质可拖拽
// setModelMeshDrag(model: { modelDrag: boolean }) {
// 	const { modelDrag } = model
// 	// 先把之前的拖拽信息给清除掉
// 	if (this.dragControls) this.dragControls.dispose()
// 	if (modelDrag) {
// 		this.dragControls = new DragControls(this.modelMaterialList, this.camera, this.renderer.domElement);
// 		// 拖拽事件监听
// 		this.dragControls.addEventListener('dragstart', () => {
// 			this.controls.enabled = false
// 		})

// 		this.dragControls.addEventListener('dragend', () => {
// 			this.controls.enabled = true
// 		})
// 	}
// }

// // 获取模型材质位拖拽置
// getMeshDragPosition() {
// 	const positonList: any[] = []
// 	this.modelMaterialList.forEach((v: { name: any }) => {
// 		const mesh = this.model.getObjectByProperty('name', v.name)
// 		const obj = {
// 			name: v.name,
// 			...mesh.position
// 		}
// 		positonList.push(obj)
// 	})
// 	return positonList
// }
// // 修改辉光颜色
// onSetFlowColor(color: any) {
// 	this.shaderPass.material.uniforms.glowColor.value = new THREE.Color(color)
// }




const setModelMeshDecompose = (meshDecompose: any, arg1: { decompose: any }) => {
	const { decompose } = meshDecompose
	// console.log(this.glowMaterialList)
	// if (this.glowMaterialList.length <= 1) return false
	// const modelDecomposeMove = (obj: any, position: { [x: string]: any }) => {
	// 	const Tween = new TWEEN.Tween(obj.position)
	// 	Tween.to(position, 500)
	// 	Tween.onUpdate(function (val) {
	// 		obj.position.set(val.x || 0, val.y || 0, val.z || 0);
	// 	})
	// 	Tween.start()
	// }
	// const length = this.glowMaterialList.length
	// const angleStep = (2 * Math.PI) / length;
	// this.glowMaterialList.forEach((name: string | number, i: number) => {
	// 	const mesh = this.model.getObjectByName(name)
	// 	const { decomposeName } = this.model
	// 	if (mesh.type == 'Mesh') {
	// 		// 如果当前模型有设置模型分解的自定义参数
	// 		if ((MODEL_DECOMPOSE as any)[decomposeName] && (MODEL_DECOMPOSE as any)[decomposeName][name]) {
	// 			const position = { x: 0, y: 0, z: 0 }
	// 			const { x: modelX, y: modelY, z: modelZ } = (MODEL_DECOMPOSE as any)[decomposeName][name]
	// 			if (modelX == 'straight') {
	// 				position.x += decompose
	// 			} else if (modelX == 'burden') {
	// 				position.x -= decompose
	// 			}
	// 			if (modelY == 'straight') {
	// 				position.y += decompose
	// 			} else if (modelY == 'burden') {
	// 				position.y -= decompose
	// 			}
	// 			if (modelZ == 'straight') {
	// 				position.z += decompose
	// 			} else if (modelZ == 'burden') {
	// 				position.z -= decompose
	// 			}
	// 			modelDecomposeMove(mesh, position)
	// 		} else {
	// 			// 材质位置计算
	// 			const angle = i * angleStep;
	// 			const x = (decompose) * Math.cos(angle);
	// 			const y = (decompose) * Math.sin(angle);
	// 			const position = {
	// 				x, y, z: 0
	// 			}
	// 			modelDecomposeMove(mesh, position)
	// 		}
	// 	}
	// })
}

function setModelMeshDrag(model: any, arg1: { modelDrag: any }) {
}

function getMeshDragPosition() {
	throw new Error("Function not implemented.")
}

function onSetFlowColor(color: any, string: any) {
	throw new Error("Function not implemented.")
}

export default {

	setModelMeshDecompose:setModelMeshDecompose.bind(this),
	setModelMeshDrag,
	getMeshDragPosition,
}