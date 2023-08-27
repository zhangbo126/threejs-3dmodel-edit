
import { defineComponent, h } from 'vue'
import * as THREE from 'three' //导入整个 three.js核心库
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' //导入控制器模块，轨道控制器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader' //导入GLTF模块，模型解析器,根据文件格式来定
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter'
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { vertexShader, fragmentShader, MODEL_DECOMPOSE } from '@/config/constant.js'

/**
 * @describe 创建3d模型组件的方法
 * @param config 组件参数配置信息
*/

class renderModel {
	constructor(config) {
		const { fileInfo } = config
		this.config = config
		this.container = document.querySelector('#' + fileInfo.key)
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
		// 辉光效果合成器
		this.glowComposer
		// 辉光渲染器
		this.unrealBloomPass
		// 需要辉光的材质
		this.glowMaterialList
		this.materials = {}
		// 拖拽对象控制器
		this.dragControls
		// 是否显示材质标签
		this.hoverMeshTag = false
	}
	init() {
		return new Promise(async (reslove, reject) => {
			//初始化渲染器
			this.initRender()
			// //初始化相机
			this.initCamera()
			//初始化场景
			this.initScene()
			//初始化控制器，控制摄像头,控制器一定要在渲染器后
			this.initControls()
			// 创建灯光
			this.createLight()
			const load = await this.loadModel(this.config.fileInfo)
			// 创建效果合成器
			this.createEffectComposer()
			//监听场景大小改变，跳转渲染尺寸
			window.addEventListener("resize", this.onWindowResize.bind(this))
			//场景渲染
			this.sceneAnimation()
			reslove(load)
		})
	}
	// 创建渲染器
	initRender() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) //设置抗锯齿
		//设置屏幕像素比
		this.renderer.setPixelRatio(window.devicePixelRatio)
		//渲染的尺寸大小
		const { clientHeight, clientWidth } = this.container
		this.renderer.setSize(clientWidth, clientHeight)
		//色调映射
		this.renderer.toneMapping = THREE.ReinhardToneMapping
		this.renderer.outputEncoding = THREE.sRGBEncoding
		//曝光
		this.renderer.toneMappingExposure = 3
		this.renderer.shadowMap.enabled = true
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
		this.container.appendChild(this.renderer.domElement)
	}
	// 创建相机
	initCamera() {
		const { clientHeight, clientWidth } = this.container
		this.camera = new THREE.PerspectiveCamera(45, clientWidth / clientHeight, 0.25, 100)
	}
	// 创建场景
	initScene() {
		this.scene = new THREE.Scene()
		const { background } = this.config
		if (!background) return false

		if (background.visible) {
			const { color, image, viewImg } = background
			switch (background.type) {
				case 1:
					this.scene.background = new THREE.Color(color)
					break;
				case 2:
					this.scene.background = new THREE.TextureLoader().load(image);
					break;
				case 3:
					const texture = new THREE.TextureLoader().load(viewImg);
					texture.mapping = THREE.EquirectangularReflectionMapping
					this.scene.background = texture
					this.scene.environment = texture
					break;
				default:
					break;
			}
		} else {
			this.scene.background = new THREE.Color('#000')
		}
	}

	// 创建控制器
	initControls() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement)
		this.controls.enablePan = true
	}
	// 更新场景
	sceneAnimation() {
		this.renderAnimation = requestAnimationFrame(() => this.sceneAnimation())
		this.controls.update()
		// 将不需要处理辉光的材质进行存储备份
		this.scene.traverse((v) => {
			if (v instanceof THREE.Scene) {
				this.materials.scene = v.background
				v.background = null
			}
			if (!this.glowMaterialList.includes(v.name) && v.isMesh) {
				this.materials[v.uuid] = v.material
				v.material = new THREE.MeshBasicMaterial({ color: 'black' })
			}
		})
		this.glowComposer.render()
		// 在辉光渲染器执行完之后在恢复材质原效果
		this.scene.traverse((v) => {
			if (this.materials[v.uuid]) {
				v.material = this.materials[v.uuid]
				delete this.materials[v.uuid]
			}
			if (v instanceof THREE.Scene) {
				v.background = this.materials.scene
				delete this.materials.scene
			}
		})
		this.effectComposer.render()
	}
	// 创建效果合成器
	createEffectComposer() {
		const { clientHeight, clientWidth } = this.container
		this.effectComposer = new EffectComposer(this.renderer)
		const renderPass = new RenderPass(this.scene, this.camera)
		this.effectComposer.addPass(renderPass)
		this.outlinePass = new OutlinePass(new THREE.Vector2(clientWidth, clientHeight), this.scene, this.camera)
		this.outlinePass.visibleEdgeColor = new THREE.Color('#FF8C00') // 可见边缘的颜色
		this.outlinePass.hiddenEdgeColor = new THREE.Color('#8a90f3') // 不可见边缘的颜色
		this.outlinePass.edgeGlow = 2.0 // 发光强度
		this.outlinePass.edgeThickness = 1 // 边缘浓度
		this.outlinePass.edgeStrength = 4 // 边缘的强度，值越高边框范围越大
		this.outlinePass.pulsePeriod = 100 // 闪烁频率，值越大频率越低
		this.effectComposer.addPass(this.outlinePass)

		let effectFXAA = new ShaderPass(FXAAShader)
		const pixelRatio = this.renderer.getPixelRatio()
		effectFXAA.uniforms.resolution.value.set(1 / (clientWidth * pixelRatio), 1 / (clientHeight * pixelRatio))
		effectFXAA.renderToScreen = true
		effectFXAA.needsSwap = true
		this.effectComposer.addPass(effectFXAA)

		//创建辉光效果
		this.unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(clientWidth, clientHeight), 0, 0, 0)
		this.unrealBloomPass.threshold = 0
		this.unrealBloomPass.strength = 0
		this.unrealBloomPass.radius = 0
		this.unrealBloomPass.renderToScreen = false
		// 辉光合成器
		this.glowComposer = new EffectComposer(this.renderer)
		this.glowComposer.renderToScreen = false
		this.glowComposer.addPass(new RenderPass(this.scene, this.camera))
		this.glowComposer.addPass(this.unrealBloomPass)
		// 着色器
		let shaderPass = new ShaderPass(new THREE.ShaderMaterial({
			uniforms: {
				baseTexture: { value: null },
				bloomTexture: { value: this.glowComposer.renderTarget2.texture },
				tDiffuse: {
					value: null
				}
			},
			vertexShader,
			fragmentShader,
			defines: {}
		}), 'baseTexture')

		shaderPass.renderToScreen = true
		shaderPass.needsSwap = true
		this.effectComposer.addPass(shaderPass)

	}
	// 加载模型
	loadModel({ filePath, fileType, scale, map, position, decomposeName }) {
		return new Promise((resolve, reject) => {
			const loader = this.fileLoaderMap[fileType]
			loader.load(filePath, (result) => {
				switch (fileType) {
					case 'glb':
						this.model = result.scene
						this.model.decomposeName = decomposeName
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
							// this.onStartModelAnimaion(config)
						}
						this.getModelMeaterialList(map)
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
				this.glowMaterialList = this.modelMaterialList.map(v => v.name)
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
	onWindowResize() {
		const { clientHeight, clientWidth } = this.container
		//调整屏幕大小
		this.camera.aspect = clientWidth / clientHeight //摄像机宽高比例
		this.camera.updateProjectionMatrix() //相机更新矩阵，将3d内容投射到2d面上转换
		this.renderer.setSize(clientWidth, clientHeight)
		this.effectComposer.setSize(clientWidth, clientHeight)
		this.glowComposer.setSize(clientWidth, clientHeight)
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
		this.planeGeometry.name = 'planeGeometry'
		this.planeGeometry.rotation.x = -Math.PI / 2
		this.planeGeometry.position.set(0, -.5, 0)

		// 让地面接收阴影
		this.planeGeometry.receiveShadow = true;
		this.planeGeometry.visible = false
		this.scene.add(this.planeGeometry);
	}
	// 设置模型定位缩放大小
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
		// this.model.position.sub(center.multiplyScalar(scale))
		// 设置控制器最小缩放值
		this.controls.maxDistance = size.length() * 10
		// 设置相机位置
		this.camera.position.set(0, 2, 6)
		// 设置相机坐标系
		this.camera.lookAt(center)
		this.camera.updateProjectionMatrix();

	}
	// 获取当前模型材质
	getModelMeaterialList(map) {
		const isMap = map ? true : false
		this.modelMaterialList = []
		this.modelTextureMap = []
		let i = 0;
		this.model.traverse((v) => {
			const { uuid } = v
			if (v.isMesh) {
				v.castShadow = true
				v.frustumCulled = false
				i++;
				if (v.material) {
					const materials = Array.isArray(v.material) ? v.material : [v.material]
					const { name, color, map } = v.material
					// 统一将模型材质 设置为 MeshLambertMaterial 类型
					v.material = new THREE.MeshStandardMaterial({
						map,
						transparent: true,
						color,
						name,
					})
					this.modelMaterialList.push(v)
					// 获取模型自动材质贴图
					const { url, mapId } = this.getModelMaps(materials, uuid)
					const mesh = {
						material: v.material,
						url,
						mapId: mapId + '_' + i
					}
					// 获取当前模型材质
					v.mapId = mapId + '_' + i
					this.modelTextureMap.push(mesh)
				}
				// 部分模型本身没有贴图需 要单独处理
				if (v.material && isMap) {
					const mapTexture = new THREE.TextureLoader().load(map)
					const { color, name } = v.material
					v.material = new THREE.MeshStandardMaterial({
						map: mapTexture,
						name,
						transparent: true,
						color,
					})
					v.mapId = uuid + '_' + i
					this.modelTextureMap = [{
						material: v.material,
						url: map,
						mapId: uuid + '_' + i
					}]
				}
			}
		})
	}
	// 获取模型自带贴图
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
	// 设置模型定位缩放大小
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
		// this.model.position.sub(center.multiplyScalar(scale))
		// 设置控制器最小缩放值
		this.controls.maxDistance = size.length() * 10
		// 设置相机位置
		this.camera.position.set(0, 2, 6)
		// 设置相机坐标系
		this.camera.lookAt(center)
		this.camera.updateProjectionMatrix();

	}
}


/**
 * @describe 创建3d模型组件的方法
 * @param config 组件参数配置信息
*/

function createThreeDComponent(config) {
	const { fileInfo } = config

	return defineComponent({
		data() {
			return {
				loading: false
			}
		},
		render() {
			return h(<div v-zLoading={this.loading} style={{ width: '100%', height: '100vh' }} id={fileInfo.key} ></div>)
		},
		async mounted() {
			this.loading = true
			const modelApi = new renderModel(config);
			const load = await modelApi.init()
			if (load) {
				this.loading = false
			}
		}
	})
}


export default createThreeDComponent