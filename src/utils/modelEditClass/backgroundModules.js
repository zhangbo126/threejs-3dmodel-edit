
/**
 * @describe 背景模块方法
* @function onSetSceneColor 设置场景颜色
* @function onSetSceneImage 设置场景图片
* @function onSetSceneViewImage 设置全景图
*/
import * as THREE from 'three' 

function onSetSceneColor(color) {
	this.scene.background = new THREE.Color(color)
}
// 设置场景图片
function onSetSceneImage(url) {
	const texture = new THREE.TextureLoader().load(url);
	this.scene.background = texture
	texture.dispose()
}
// 设置全景图
function onSetSceneViewImage(url) {
	const texture = new THREE.TextureLoader().load(url);
	texture.mapping = THREE.EquirectangularReflectionMapping
	this.scene.background = texture
	this.scene.environment = texture
	texture.dispose()
}

export default {
	onSetSceneColor,
	onSetSceneImage,
	onSetSceneViewImage
}