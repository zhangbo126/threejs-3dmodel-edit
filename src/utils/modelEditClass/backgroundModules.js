
/**
 * @describe 背景模块方法
* @function onSetSceneColor 设置场景颜色
* @function onSetSceneImage 设置场景图片
* @function onSetSceneViewImage 设置全景图
* @function onSetSceneViewConfig 设置全景图参数
* @function onSetStorageViewImage 加载外部全景图
*/
import * as THREE from 'three'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'

function onSetSceneColor(color) {
	this.scene.background = new THREE.Color(color)
}
// 设置场景图片
function onSetSceneImage(url) {
	const texture = new THREE.TextureLoader().load(url);
	this.scene.background = texture
	this.scene.backgroundIntensity = 1
	texture.dispose()
}
// 设置全景图
function onSetSceneViewImage(config) {
	return new Promise((reslove) => {
		const { blurriness, intensity, viewImg } = config
		const texture = new THREE.TextureLoader().load(viewImg);
		texture.mapping = THREE.EquirectangularReflectionMapping
		this.scene.background = texture
		this.scene.environment = texture
		this.scene.backgroundIntensity = intensity
		this.scene.backgroundBlurriness = blurriness
		texture.dispose()
		reslove()
	})
}

// 设置全景图
function onSetSceneViewConfig(config) {
	const { blurriness, intensity } = config
	this.scene.backgroundIntensity = intensity
	this.scene.backgroundBlurriness = blurriness
}

// 设置模型贴图 (外部) 
function onSetStorageViewImage(url, type) {
	return new Promise(async (reslove) => {
		// 根据 图片类型选择不同的加载器
		let loader
		let texture
		if (type == 'hdr') {
			loader = new RGBELoader()
		} else {
			loader = new THREE.TextureLoader()
		}
		texture = await loader.loadAsync(url)
		texture.mapping = THREE.EquirectangularReflectionMapping
		this.scene.background = texture
		this.scene.environment = texture
		texture.dispose()
		reslove()
	})

}

export default {
	onSetSceneColor,
	onSetSceneImage,
	onSetSceneViewImage,
	onSetSceneViewConfig,
	onSetStorageViewImage
}