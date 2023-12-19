/**
	 * @describe 材质模块方法
	 * @function getModelMeaterialList 获取当前模型材质
	 * @function setModelPositionSize 设置模型定位缩放大小
	 * @function getModelMaps 获取模型自带贴图
	 * @function onSetModelMaterial 设置材质属性（网格,透明度，颜色，深度写入）
	 * @function onSetModelMap 设置模型贴图（模型自带）
	 * @function onSetSystemModelMap 设置模型贴图（系统贴图）
	 * @function onChangeModelMeaterial 选择材质
	 * @function onGetEditMeshList 获取最新材质信息列表
	 * @function onChangeModelMeshType 切换材质类型
	 * @function onSetGeometryMeshList 设置几何体模型材质
	 */

import * as THREE from 'three' 
import {  ElMessageBox } from 'element-plus';
import { useMeshEditStore } from '@/store/meshEditStore'
const store = useMeshEditStore()

// 获取当前模型材质
function getModelMeaterialList() {
	this.modelMaterialList = []
	this.model.traverse((v) => {
		if (v.isMesh) {
			v.castShadow = true
			v.frustumCulled = false
			if (v.material) {
				const newMaterial = v.material.clone()
				v.material = newMaterial
				this.modelMaterialList.push(v)
			}
		}
	})
}

// 获取当前模型材质贴图
function getModelMeaterialMaps(map) {
	this.modelTextureMap = []
	// TODO 获取当前模型材质数量如果超过100个 则不加载模型自带贴图
	const materials = new Set();
	this.model.traverse((node) => {
		if (node.isMesh) {
			const meshMaterials = Array.isArray(node.material) ? node.material : [node.material];
			meshMaterials.forEach((material) => materials.add(material));
		}
	});

	const numMaterials = materials.size;
	if (numMaterials > 100) {
		ElMessageBox.alert(`当前模型材质数量过大“${numMaterials}个”，编辑器页面可能有卡顿`, '提示', {
			confirmButtonText: '确认',
		})
		return this.modelTextureMap = null
	}

	const isMap = map ? true : false
	let i = 0;
	this.model.traverse((v) => {
		const { uuid } = v
		if (v.isMesh && v.material) {
			i++;
			const materials = Array.isArray(v.material) ? v.material : [v.material]
			const { url, mapId } = this.getModelMaps(materials, uuid)
			const mesh = {
				meshName: v.name,
				material: v.material,
				url,
				mapId: mapId + '_' + i
			}
			// 获取当前模型材质
			v.mapId = mapId + '_' + i
			this.modelTextureMap.push(mesh)
			// 部分模型本身没有贴图需 要单独处理
			if (isMap) {
				const mapTexture = new THREE.TextureLoader().load(map)
				const newMaterial = v.material.clone()
				v.material = newMaterial
				v.material.map = mapTexture
				v.mapId = uuid + '_' + i
				this.modelTextureMap = [{
					meshName: v.name,
					material: v.material,
					url: map,
					mapId: uuid + '_' + i
				}]
			}
		}
	})

}
// 设置模型定位缩放大小
function setModelPositionSize() {
	//设置模型位置
	this.model.updateMatrixWorld()
	const box = new THREE.Box3().setFromObject(this.model);
	const size = box.getSize(new THREE.Vector3());
	const center = box.getCenter(new THREE.Vector3());
	// 计算缩放比例
	const maxSize = Math.max(size.x, size.y, size.z);
	const targetSize = 2.5; // 目标大小
	const scale = targetSize / (maxSize > 1 ? maxSize : .5);
	this.model.scale.set(scale, scale, scale)
	// 设置模型位置
	// this.model.position.sub(center.multiplyScalar(scale))
	// 设置控制器最小缩放值
	this.controls.maxDistance = size.length() * 10
	// 设置相机位置
	this.camera.position.set(0, 2, 6)
	// 设置相机坐标系
	this.camera.lookAt(center)
	this.camera.updateProjectionMatrix();

}
// 获取模型自带贴图
function getModelMaps(materials, uuid) {
	let textureMap = {}
	materials.forEach(texture => {
		if (texture.map && texture.map.image) {
			const canvas = document.createElement('canvas')
			const { width, height } = texture.map.image
			canvas.width = 75
			canvas.height = 75
			const context = canvas.getContext('2d')
			context.drawImage(texture.map.image, 0, 0)
			textureMap = {
				url: canvas.toDataURL('image/png', .5),
			}
			canvas.remove()
		}
	})
	return textureMap
}
// 设置材质属性
function onSetModelMaterial(config) {
	const { color, wireframe, depthWrite, opacity } = JSON.parse(JSON.stringify(config))
	const uuid = store.selectMesh.uuid
	const mesh = this.scene.getObjectByProperty('uuid', uuid)
	if (mesh && mesh.material) {
		const { name, map } = mesh.material
		Object.assign(mesh.material, {
			map,
			name,
			transparent: true,
			color: new THREE.Color(color),
			wireframe,
			depthWrite,
			opacity
		})
	}
}
// 设置模型贴图（模型自带）
function onSetModelMap({ material, mapId, meshName }) {
	const uuid = store.selectMesh.uuid
	const mesh = this.scene.getObjectByProperty('uuid', uuid)
	mesh.material = material.clone()
	mesh.mapId = mapId
	// 设置当前材质来源唯一标记值key 用于预览处数据回填需要
	mesh.meshFrom = meshName
}
// 设置模型贴图（系统贴图）
function onSetSystemModelMap({ id, url }) {
	const uuid = store.selectMesh.uuid
	const mesh = this.scene.getObjectByProperty('uuid', uuid)
	const mapTexture = new THREE.TextureLoader().load(url)
	const newMaterial = mesh.material.clone()
	newMaterial.map = mapTexture
	mesh.material = newMaterial
	mesh.mapId = id
	// 设置当前材质来源唯一标记值key 用于预览处数据回填需要
	mesh.meshFrom = id
}
// 选择材质
function onChangeModelMeaterial(name) {
	const mesh = this.model.getObjectByName(name)
	this.outlinePass.selectedObjects = [mesh]
	store.selectMeshAction(mesh)
	return mesh
}

// 模型点击事件
function onMouseClickModel(event) {
	const { clientHeight, clientWidth, offsetLeft, offsetTop } = this.container
	this.mouse.x = ((event.clientX - offsetLeft) / clientWidth) * 2 - 1
	this.mouse.y = -((event.clientY - offsetTop) / clientHeight) * 2 + 1
	this.raycaster.setFromCamera(this.mouse, this.camera)
	const intersects = this.raycaster.intersectObjects(this.scene.children).filter(item => item.object.isMesh)
	if (intersects.length > 0) {
		const intersectedObject = intersects[0].object
		this.outlinePass.selectedObjects = [intersectedObject]
		store.selectMeshAction(intersectedObject)

	} else {
		this.outlinePass.selectedObjects = []
		store.selectMeshAction({})
	}
}
// 获取最新材质信息列表
function onGetEditMeshList() {
	const meshList = []
	this.model.traverse((v) => {
		if (v.isMesh && v.material) {
			const { color, opacity, depthWrite, wireframe } = v.material
			const obj = {
				meshName: v.name,
				meshFrom: v.meshFrom,
				color: color.getStyle(),
				opacity, depthWrite, wireframe,
				visible: v.visible,
				type: v.material.type
			}
			meshList.push(obj)
		}
	})
	return meshList
}
// 设置材质类型
function onChangeModelMeshType(activeMesh) {
	this.model.traverse(v => {
		if (v.isMesh && v.material) {
			const { name, color, map, wireframe, depthWrite, opacity } = v.material
			v.material = new THREE[activeMesh.type]({
				map,
				transparent: true,
				color,
				name,
			})
			depthWrite ? v.material.depthWrite = depthWrite : ''
			opacity ? v.material.opacity = opacity : ''
			wireframe ? v.material.wireframe = wireframe : ''
		}
	})
}
// 设置几何体材质
function onSetGeometryMeshList(v) {
	this.modelMaterialList = []
	this.modelTextureMap = []
	this.model.traverse((v) => {
		const { uuid, name } = v
		v.castShadow = true
		v.frustumCulled = false
		if (v.isMesh && v.material) {
			const materials = Array.isArray(v.material) ? v.material : [v.material]
			// 统一将模型材质 设置为 MeshLambertMaterial 类型
			this.modelMaterialList.push(v)
			// 获取模型自动材质贴图
			const { url } = this.getModelMaps(materials, uuid)
			const mesh = {
				meshName: v.name,
				material: v.material,
				url,
				mapId: name
			}
			// 获取当前模型材质
			v.mapId = name
			this.modelTextureMap.push(mesh)
		}
	})
}

export default {
	getModelMeaterialList,
	getModelMeaterialMaps,
	setModelPositionSize,
	getModelMaps,
	onSetModelMaterial,
	onSetModelMap,
	onSetSystemModelMap,
	onChangeModelMeaterial,
	onMouseClickModel,
	onGetEditMeshList,
	onChangeModelMeshType,
	onSetGeometryMeshList
}