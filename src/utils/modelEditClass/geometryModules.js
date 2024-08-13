/**
 * @describe 几何体模块方法
 * @function onDeleteGeometryMesh 删除几何体材质
 * @function onSetGeometryMesh 修改几何体材质信息
 */

import * as THREE from 'three'
import { useMeshEditStore } from '@/store/meshEditStore'
const store = useMeshEditStore()

function onDeleteGeometryMesh(uuid) {
	// 找到需要删除的材质
	const mesh = this.scene.getObjectByProperty('uuid', uuid)
	this.modelMaterialList = this.modelMaterialList.filter(v => v.uuid != uuid)
	this.glowMaterialList = this.modelMaterialList.map(v => v.name)
	mesh.clear()
	this.geometryGroup.remove(mesh)
}
function onSetGeometryMesh(activeGeometry, type) {
	const uuid = store.selectMesh.uuid
	const mesh = this.scene.getObjectByProperty('uuid', uuid)
	const geometryData = Object.keys(activeGeometry).map(v => activeGeometry[v])
	// 创建几何体
	const newGeometry = new THREE[type](...geometryData)
	mesh.geometry = newGeometry
}



export default {
	onDeleteGeometryMesh,
	onSetGeometryMesh
}