import * as THREE from 'three' //导入整个 three.js核心库
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader' //导入RGB加载器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' //导入控制器模块，轨道控制器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader' //导入GLTF模块，模型解析器,根据文件格式来定
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter'
import { ElMessage } from 'element-plus';
import { lightPosition } from '@/utils/utilityFunction'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import store from '@/store'
class renderModel {
	constructor(selector) {
		this.container = document.querySelector(selector)
		// 相机
		this.camera
		// 场景
		this.scene
		//渲染器
		this.renderer
		// 控制器
		this.controls
		// 模型
		this.model
		//文件加载器类型
		this.fileLoaderMap = {
			'glb': new GLTFLoader(),
			'fbx': new FBXLoader(),
			'gltf': new GLTFLoader(),
			'obj': new OBJLoader(),
		}
		// 全景图材质
		this.viewMesh
		//模型动画列表
		this.modelAnimation
		//模型动画对象
		this.animationMixer
		this.animationColock = new THREE.Clock()
		//动画帧
		this.animationFrame
		// 动画构造器
		this.animateClipAction = null
		// 动画循环方式枚举
		this.loopMap = {
			LoopOnce: THREE.LoopOnce,
			LoopRepeat: THREE.LoopRepeat,
			LoopPingPong: THREE.LoopPingPong
		}
		// 模型骨架
		this.skeletonHelper
		// 网格辅助线
		this.gridHelper
		// 坐标轴辅助线
		this.axesHelper
		// 轴旋转动画对象
		this.rotationAnimate
		// 环境光
		this.ambientLight
		//平行光
		this.directionalLight
		// 平行光辅助线
		this.directionalLightHelper
		// 点光源
		this.pointLight
		//点光源辅助线
		this.pointLightHelper
		//聚光灯
		this.spotLight
		//聚光灯辅助线
		this.spotLightHelper
		//模型平面
		this.planeGeometry
		//模型材质列表
		this.modelMaterialList
		// 效果合成器
		this.effectComposer
		this.outlinePass
		// 动画渲染器
		this.renderAnimation
		// 碰撞检测
		this.raycaster = new THREE.Raycaster()
		// 鼠标位置
		this.mouse = new THREE.Vector2()
		// 模型自带贴图
		this.modelTextureMap
	}
	init() {
		return new Promise(async (reslove, reject) => {
			//初始化场景
			this.initScene()
			//初始化相机
			this.initCamera()
			//初始化渲染器
			this.initRender()
			//初始化控制器，控制摄像头,控制器一定要在渲染器后
			this.initControls()
			// 创建辅助线
			this.createHelper()
			// 创建灯光
			this.createLight()
			// 创建效果合成器
			this.createEffectComposer()
			// 添加物体模型 TODO：初始化时需要默认一个
			const load = await this.setModel({ filePath: 'threeFile/glb/glb-3.glb', fileType: 'glb' })
			//监听场景大小改变，跳转渲染尺寸
			window.addEventListener("resize", this.onWindowResize.bind(this))
			//场景渲染
			this.sceneAnimation()
			this.addEvenListMouseLiatener()
			reslove(load)
		})
	}
	//创建场景
	initScene() {
		this.scene = new THREE.Scene()
		const sphereBufferGeometry = new THREE.SphereGeometry(30, 32, 16);
		sphereBufferGeometry.scale(-1, -1, -1);
		const material = new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load(require('@/assets/image/view-4.png'))
		});
		this.viewMesh = new THREE.Mesh(sphereBufferGeometry, material);
		this.scene.add(this.viewMesh);

	}
	// 创建相机
	initCamera() {
		const { clientHeight, clientWidth } = this.container
		this.camera = new THREE.PerspectiveCamera(45, clientWidth / clientHeight, 0.25, 100)
	}
	// 创建 渲染器
	initRender() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) //设置抗锯齿
		//设置屏幕像素比
		this.renderer.setPixelRatio(window.devicePixelRatio)
		//渲染的尺寸大小
		const { clientHeight, clientWidth } = this.container
		this.renderer.setSize(clientWidth, clientHeight)
		//色调映射
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping
		//曝光
		this.renderer.toneMappingExposure = 3
		this.renderer.shadowMap.enabled = true
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
		this.container.appendChild(this.renderer.domElement)

	}

	render() {
		this.effectComposer.render()
		this.controls.update()
		// this.renderer.render(this.scene, this.camera)

	}
	sceneAnimation() {
		this.renderAnimation = requestAnimationFrame(() => this.sceneAnimation())
		this.effectComposer.render()
		this.controls.update()
		//this.renderer.render(this.scene, this.camera)

	}
	// 监听鼠标点击模型
	addEvenListMouseLiatener() {
		this.container.addEventListener('click', this.onMouseClickModel.bind(this))
	}
	// 模型点击事件
	onMouseClickModel(event) {
		const { clientHeight, clientWidth, offsetLeft, offsetTop } = this.container
		this.mouse.x = ((event.clientX - offsetLeft) / clientWidth) * 2 - 1
		this.mouse.y = -((event.clientY - offsetTop) / clientHeight) * 2 + 1
		this.raycaster.setFromCamera(this.mouse, this.camera)
		const intersects = this.raycaster.intersectObjects(this.scene.children).filter(item => item.object.isMesh)
		if (intersects.length > 0) {
			const intersectedObject = intersects[0].object
			this.outlinePass.selectedObjects = [intersectedObject]
			store.commit('SELECT_MESH', intersectedObject)
		} else {
			this.outlinePass.selectedObjects = []
			store.commit('SELECT_MESH', {})
		}
	}
	initControls() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement)
		// this.controls.enableDamping = true
		// this.controls.minDistance=10
		// this.controls.maxDistance = 50
		this.controls.enablePan = false
	}
	//加载模型
	setModel({ filePath, fileType, scale, map, position }) {
		return new Promise((resolve, reject) => {
			const loader = this.fileLoaderMap[fileType]
			loader.load(filePath, (result) => {
				switch (fileType) {
					case 'glb':
						this.model = result.scene
						this.skeletonHelper = new THREE.SkeletonHelper(result.scene)
						this.modelAnimation = result.animations || []
						// 如果当前模型有动画则默认播放第一条动画
						if (this.modelAnimation.length) {
							const animationName = this.modelAnimation[0].name
							const config = {
								animations: this.modelAnimation,
								timeScale: 1, // 播放速度
								weight: 1, // 动作幅度
								loop: "LoopRepeat",
								animationName
							}
							this.onStartModelAnimaion(config)
						}
						const isMap = map ? true : false
						this.modelMaterialList = []
						this.modelTextureMap = []
						this.model.traverse((v) => {
							const { uuid } = v
							if (v.isMesh) {
								v.castShadow = true
								v.frustumCulled = false
								if (v.material) {
									const materials = Array.isArray(v.material) ? v.material : [v.material]
									const { url, mapId } = this.getModelMaps(materials, uuid)
									const mesh = {
										material: v.material,
										url,
										mapId
									}
									this.modelTextureMap.push(mesh)
									// 获取当前模型材质
									v.mapId = mapId
									this.modelMaterialList.push(v)
								}
								// 部分模型本身没有贴图需 要单独处理
								if (v.material && isMap) {
									const mapTexture = new THREE.TextureLoader().load(map)
									const { color, name } = v.material
									v.material = new THREE.MeshLambertMaterial({
										map: mapTexture,
										name,
										color,
									})
									v.mapId = uuid
									this.modelTextureMap = [{
										material: v.material,
										url: map,
										mapId: uuid
									}]
								}
							}
						})
						break;
					case 'fbx':
						this.model = result
						break;
					case 'gltf':
						this.model = result.scene
						break;
					case 'obj':
						this.model = result
						break;
					default:
						break;
				}
				this.setModelPositionSize()
				//	设置模型大小
				if (scale) {
					this.model.scale.set(scale, scale, scale);
				}
				//设置模型位置 
				this.model.position.set(0, -.5, 0)
				if (position) {
					const { x, y, z } = position
					this.model.position.set(x, y, z)
				}
				this.skeletonHelper.visible = false
				this.scene.add(this.skeletonHelper)
				this.scene.add(this.model)
				resolve(true)
			}, () => {

			}, (err) => {
				ElMessage.error('文件错误')
				console.log(err)
				reject()
			})
		})
	}
	//设置模型定位大小
	setModelPositionSize() {
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
		this.model.position.sub(center.multiplyScalar(scale))
		// 设置控制器最小缩放值
		this.controls.maxDistance = size.length() * 10
		// 设置相机位置
		this.camera.position.set(0, 2, 6)
		// 设置相机坐标系
		this.camera.lookAt(center)
		this.camera.updateProjectionMatrix();

	}
	// 获取模型贴图
	getModelMaps(materials, uuid) {
		let textureMap = {}
		materials.forEach(texture => {
			if (texture.map && texture.map.image) {
				const canvas = document.createElement('canvas')
				const { width, height } = texture.map.image
				canvas.width = width
				canvas.height = height
				const context = canvas.getContext('2d')
				context.drawImage(texture.map.image, 0, 0)
				textureMap = {
					url: canvas.toDataURL('image/png'),
					mapId: texture.uuid
				}

			}
		})
		return textureMap
	}
	// 创建辅助线
	createHelper() {
		//网格辅助线
		this.gridHelper = new THREE.GridHelper(4, 10, 'rgb(193,193,193)', 'rgb(193,193,193)');
		this.gridHelper.position.set(0, -.59, -.1)
		this.gridHelper.visible = false
		this.scene.add(this.gridHelper)
		// 坐标轴辅助线
		this.axesHelper = new THREE.AxesHelper(2);
		this.axesHelper.visible = false
		this.scene.add(this.axesHelper);
		// 开启阴影
		this.renderer.shadowMap.enabled = true;

	}
	// 创建光源
	createLight() {
		// 创建环境光
		this.ambientLight = new THREE.AmbientLight('#fff', .8)
		this.scene.add(this.ambientLight)

		// 创建平行光
		this.directionalLight = new THREE.DirectionalLight('#1E90FF', 1)
		this.directionalLight.position.set(-1.44, 2.2, 1)
		this.directionalLight.castShadow = true
		this.directionalLight.visible = false
		this.scene.add(this.directionalLight)
		// 创建平行光辅助线
		this.directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight, .5)
		this.directionalLightHelper.visible = false
		this.scene.add(this.directionalLightHelper)

		// 创建点光源
		this.pointLight = new THREE.PointLight(0xff0000, 1, 100)
		this.pointLight.visible = false
		this.scene.add(this.pointLight)
		// 创建点光源辅助线
		this.pointLightHelper = new THREE.PointLightHelper(this.pointLight, .5)
		this.pointLightHelper.visible = false
		this.scene.add(this.pointLightHelper)

		//  创建聚光灯
		this.spotLight = new THREE.SpotLight('#323636', 440);
		this.spotLight.visible = false
		this.spotLight.map = new THREE.TextureLoader().load(require('@/assets/image/model-bg-1.jpg'));
		this.spotLight.decay = 2;
		this.spotLight.shadow.mapSize.width = 1920;
		this.spotLight.shadow.mapSize.height = 1080;
		this.spotLight.shadow.camera.near = 1;
		this.spotLight.shadow.camera.far = 10;
		this.scene.add(this.spotLight);
		//创建聚光灯辅助线
		this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
		this.spotLightHelper.visible = false
		this.scene.add(this.spotLightHelper)

		// 模型平面
		const geometry = new THREE.PlaneGeometry(4, 4);
		var groundMaterial = new THREE.MeshStandardMaterial({ color: '#939393' });
		this.planeGeometry = new THREE.Mesh(geometry, groundMaterial);
		this.planeGeometry.rotation.x = -Math.PI / 2
		this.planeGeometry.position.set(0, -.5, 0)
		// 让地面接收阴影
		this.planeGeometry.receiveShadow = true;
		this.planeGeometry.visible = false
		this.scene.add(this.planeGeometry);
	}
	// 创建效果合成器
	createEffectComposer() {
		const { clientHeight, clientWidth } = this.container
		this.effectComposer = new EffectComposer(this.renderer)
		const renderPass = new RenderPass(this.scene, this.camera)
		this.effectComposer.addPass(renderPass)
		this.outlinePass = new OutlinePass(new THREE.Vector2(clientWidth, clientHeight), this.scene, this.camera)
		this.outlinePass.visibleEdgeColor = new THREE.Color('#4d57fd') // 可见边缘的颜色
		this.outlinePass.hiddenEdgeColor = new THREE.Color('#8a90f3') // 不可见边缘的颜色
		this.outlinePass.edgeGlow = 2.0 // 发光强度
		//this.outlinePass.usePatternTexture = false // 是否使用纹理图案
		this.outlinePass.edgeThickness = 1 // 边缘浓度
		this.outlinePass.edgeStrength = 4 // 边缘的强度，值越高边框范围越大
		this.outlinePass.pulsePeriod = 100 // 闪烁频率，值越大频率越低
		this.effectComposer.addPass(this.outlinePass)
		// 抗锯齿
		let effectFXAA = new ShaderPass(FXAAShader)
		effectFXAA.uniforms.resolution.value.set(1 / clientWidth, 1 / clientHeight)
		// effectFXAA.renderToScreen = true
		this.effectComposer.addPass(effectFXAA)

	}
	// 切换模型
	onSwitchModel(model) {
		return new Promise(async (reslove, reject) => {
			try {
				//先移除模型 材质释放内存
				this.model.traverse((v) => {
					if (v.type === 'Mesh') {
						v.geometry.dispose();
						v.material.dispose();
					}
				})
				//取消动画帧
				cancelAnimationFrame(this.rotationAnimate)
				cancelAnimationFrame(this.animationFram)
				this.skeletonHelper.visible = false
				this.modelTextureMap = []
				this.scene.remove(this.model)
				// 加载模型
				const load = await this.setModel(model)
				// 模型加载成功返回 true
				reslove({ load, filePath: model.filePath })
			} catch {
				reject()
			}
		})
	}
	// 移除模型
	onWindowResize() {
		const { clientHeight, clientWidth } = this.container
		//调整屏幕大小
		this.camera.aspect = clientWidth / clientHeight //摄像机宽高比例
		this.camera.updateProjectionMatrix() //相机更新矩阵，将3d内容投射到2d面上转换
		this.renderer.setSize(clientWidth, clientHeight)
	}
	//设置场景颜色
	onSetSceneColor(color) {
		this.onClearSceneBg()
		this.scene.background = new THREE.Color(color)
	}
	//设置场景图片
	onSetSceneImage(url) {
		this.onClearSceneBg()
		this.scene.background = new THREE.TextureLoader().load(url);
	}
	// 设置全景图
	onSetSceneViewImage(url) {
		this.onClearSceneBg()
		const sphereBufferGeometry = new THREE.SphereGeometry(30, 32, 16);
		sphereBufferGeometry.scale(-1, -1, -1);
		const material = new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load(url)
		});
		this.viewMesh = new THREE.Mesh(sphereBufferGeometry, material);
		this.scene.add(this.viewMesh);

	}
	// 清除场景背景
	onClearSceneBg() {
		this.scene.background = new THREE.Color('rgba(212, 223, 224)')
		if (!this.viewMesh) return false
		this.viewMesh.material.dispose()
		this.viewMesh.geometry.dispose()
		this.scene.remove(this.viewMesh)
	}
	// 开始执行动画
	onStartModelAnimaion(config) {
		this.onSetModelAnimaion(config)
		cancelAnimationFrame(this.animationFram)
		this.animationFrameFun()
	}
	// 设置模型动画
	onSetModelAnimaion({ animations, animationName, loop, timeScale, weight }) {
		this.animationMixer = new THREE.AnimationMixer(this.model)
		const clip = THREE.AnimationClip.findByName(animations, animationName)
		if (clip) {
			this.animateClipAction = this.animationMixer.clipAction(clip)
			this.animateClipAction.setEffectiveTimeScale(timeScale)
			this.animateClipAction.setEffectiveWeight(weight)
			this.animateClipAction.setLoop(this.loopMap[loop])
			this.animateClipAction.play()
		}
	}
	// 动画帧
	animationFrameFun() {
		this.animationFram = requestAnimationFrame(() => this.animationFrameFun())
		if (this.animationMixer) {
			this.animationMixer.update(this.animationColock.getDelta())
		}
	}
	// 设置模型骨架
	onSetModelHelper(visible) {
		this.skeletonHelper.visible = visible
	}

	// 清除动画
	onClearAnimation() {
		if (!this.animateClipAction) return
		this.animationMixer.stopAllAction();
		this.animationMixer.update(0);
	}
	// 设置模型轴旋转
	onSetModelRotateOnAxis(type, flag) {
		cancelAnimationFrame(this.rotationAnimate)
		// 每次旋转的角度
		const maxAxis = Math.PI / 2
		let rotationSpeed = flag ? 0.08 : -0.08
		let maxRotate = 0
		const animate = () => {
			this.rotationAnimate = requestAnimationFrame(animate)
			if (Math.abs(maxRotate) >= maxAxis) return cancelAnimationFrame(this.rotationAnimate)
			this.model.rotation[type] += rotationSpeed;
			maxRotate += rotationSpeed
		}
		animate()
	}
	//重置模型轴位置
	onResultModelRotateOnAxis() {
		this.model.rotation.x = 0
		this.model.rotation.y = 0
		this.model.rotation.z = 0
	}
	// 设置模型位置
	onSetModelPosition({ positionX, positionY, positionZ }) {
		this.model.position.set(positionX, positionY, positionZ)
	}
	// 重置模型位置
	onResultModelPosition({ positionX, positionY, positionZ }) {
		this.model.position.set(positionX, positionY, positionZ)
	}
	// 重置相机位置
	onResetModelCamera() {
		// 设置相机位置
		this.camera.position.set(0, 2, 6)
		// 设置相机坐标系
		this.camera.lookAt(0, 0, 0)
	}
	//设置网格辅助线位置 和颜色
	onSetModelGridHelper({ x, y, z, gridHelper, color }) {
		this.gridHelper.visible = gridHelper
		this.gridHelper.position.set(x, y, z)
		this.gridHelper.material.color.set(color);
	}
	// 设置网格数量和大小
	onSetModelGridHelperSize({ x, y, z, size, divisions, color, gridHelper }) {
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
	onSetModelAxesHelper({ axesHelper, axesSize }) {
		// 需要先把辅助线移除然后在重新创建
		this.scene.remove(this.axesHelper)
		this.axesHelper.geometry.dispose()
		this.axesHelper.material.dispose()
		this.axesHelper = new THREE.AxesHelper(axesSize);
		this.axesHelper.position.set(0, -.50, 0)
		this.axesHelper.visible = axesHelper
		this.scene.add(this.axesHelper);
	}
	// 设置环境光
	onSetModelAmbientLight({ ambientLight, ambientLightColor, ambientLightIntensity }) {
		this.ambientLight.visible = ambientLight
		this.ambientLight.intensity = ambientLightIntensity
		this.ambientLight.color.set(ambientLightColor)
	}
	// 设置平行光
	onSetModelDirectionalLight(config) {
		const {
			directionaShadow,
			directionalHorizontal,
			directionalVertical,
			directionalSistance,
			directionalLight,
			directionalLightColor,
			directionalLightIntensity,
			directionalLightHelper
		} = config
		this.directionalLight.visible = directionalLight
		this.directionalLightHelper.visible = directionalLightHelper && directionalLight
		this.directionalLight.intensity = directionalLightIntensity
		this.directionalLight.castShadow = directionaShadow
		this.directionalLight.color.set(directionalLightColor)
		const { x, y, z } = lightPosition(directionalHorizontal, directionalVertical, directionalSistance)
		this.directionalLight.position.set(x, y, z)
		this.directionalLightHelper.update()
	}
	// 设置点光源
	onSetModelPointLight(config) {
		const { pointHorizontal, pointVertical, pointSistance, pointLight, pointLightColor, pointLightIntensity, pointLightHelper } = config
		this.pointLight.visible = pointLight
	console.log(pointLightHelper)
		this.pointLightHelper.visible = pointLight && pointLightHelper
		this.pointLight.intensity = pointLightIntensity
		this.pointLight.color.set(pointLightColor)
		const { x, y, z } = lightPosition(pointHorizontal, pointVertical, pointSistance)
		this.pointLight.position.set(x, y, z)
		this.pointLightHelper.update()
	}
	// 设置聚光灯
	onSetModelSpotLight(config) {
		const { spotDistance, spotCastShadow, spotLightHelper, spotFocus, spotPenumbra, spotAngle, spotLight, spotLightColor, spotLightIntensity, spotHorizontal, spotVertical, spotSistance } = config
		this.spotLight.visible = spotLight
		this.spotLightHelper.visible = spotLight && spotLightHelper
		this.spotLight.intensity = spotLightIntensity
		this.spotLight.angle = spotAngle
		this.spotLight.penumbra = spotPenumbra
		this.spotLight.shadow.focus = spotFocus
		this.spotLight.castShadow = spotCastShadow
		this.spotLight.distance = spotDistance
		this.spotLight.color.set(spotLightColor)
		const { x, y, z } = lightPosition(spotHorizontal, spotVertical, spotSistance)
		this.spotLight.position.set(x, y, z)
		this.spotLightHelper.update()
	}
	// 设置模型平面
	onSetModelPlaneGeometry({ planeGeometry, planeColor, planeWidth, planeHeight }) {
		this.planeGeometry.visible = planeGeometry
		this.planeGeometry.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
		this.planeGeometry.material.color.set(planeColor)
		this.planeGeometry.geometry.verticesNeedUpdate = true
	}
	// 选择材质
	onChangeModelMeaterial(name) {
		const mesh = this.model.getObjectByName(name)
		this.outlinePass.selectedObjects = [mesh]
		store.commit('SELECT_MESH', mesh)
		return mesh
	}
	// 设置材质属性
	onSetModelMaterial(config) {
		const { color, wireframe, depthWrite, opacity } = config
		const uuid = store.state.selectMesh.uuid
		const mesh = this.scene.getObjectByProperty('uuid', uuid)
		if (mesh && mesh.material) {
			//设置材质颜色
			mesh.material.color.set(new THREE.Color(color))
			//设置网格
			mesh.material.wireframe = wireframe
			// 设置深度写入
			mesh.material.depthWrite = depthWrite
			//设置透明度
			mesh.material.transparent = true
			mesh.material.opacity = opacity
		}

	}
	// 设置模型贴图
	onSetModelMap({ material, mapId }) {
		const uuid = store.state.selectMesh.uuid
		const mesh = this.scene.getObjectByProperty('uuid', uuid)
		const { name, color } = mesh.material
		mesh.material = new THREE.MeshLambertMaterial({
			map: material.map,
			transparent: true,
			color,
			name,
		})
		mesh.mapId = mapId
	}
	// 设置模型贴图
	onSetSystemModelMap({ id, url }) {
		const uuid = store.state.selectMesh.uuid
		const mesh = this.scene.getObjectByProperty('uuid', uuid)
		const { name, color } = mesh.material
		const mapTexture = new THREE.TextureLoader().load(url)
		mesh.material = new THREE.MeshLambertMaterial({
			map: mapTexture,
			transparent: true,
			color,
			name,
		})
		mesh.mapId = id
	}
}
export default renderModel