/**
	 * @describe 材质模块方法
	 * @function chooseManyModel 选择当前模型

 */
import * as THREE from 'three'


function chooseManyModel(uuid) {
	const mesh = this.scene.getObjectByProperty('uuid', uuid)
	console.log(mesh, '--------')
	if (mesh) {
		const { position } = mesh
		mesh.userData = {
			...mesh.userData,
			position
		}
		return {
			position
		}
	}
	return {}
}

function onInitModelInfo() {

}

export default {
	chooseManyModel,
	onInitModelInfo
}