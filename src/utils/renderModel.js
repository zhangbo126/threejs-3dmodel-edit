import * as THREE from 'three' //导入整个 three.js核心库
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' //导入控制器模块，轨道控制器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader' //导入GLTF模块，模型解析器,根据文件格式来定
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { ElMessage } from 'element-plus';
import { onlyKey } from '@/utils/utilityFunction'
import modulesPrototype from './modelEditClass/index'
import TWEEN from "@tweenjs/tween.js";
import { vertexShader, fragmentShader } from '@/config/constant.js'

class renderModel {
	constructor(selector) {
		this.container = document.querySelector(selector)
		// 相机
		this.camera
		// 场景
		this.scene = null
		//渲染器
		this.renderer
		// 控制器
		this.controls
		// 模型
		this.model
		// 几何体模型数组
		this.geometryGroup = new THREE.Group()
		// 几何体模型
		this.geometryModel
		// 加载进度监听
		this.loadingManager = new THREE.LoadingManager()
		//文件加载器类型
		this.fileLoaderMap = {
			'glb': new GLTFLoader(),
			'fbx': new FBXLoader(this.loadingManager),
			'gltf': new GLTFLoader(),
			'obj': new OBJLoader(this.loadingManager),
			'stl': new STLLoader(),
		}
		//模型动画列表
		this.modelAnimation
		//模型动画对象
		this.animationMixer
		this.animationColock = new THREE.Clock()
		//动画帧
		this.animationFrame = null
		// 轴动画帧
		this.rotationAnimationFrame = null
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
		this.modelMaterialList = []
		// 模型材质原始数据缓存
		this.originalMaterials = new Map()
		// 效果合成器
		this.effectComposer
		this.outlinePass
		// 动画渲染器
		this.renderAnimation = null
		// 碰撞检测
		this.raycaster = new THREE.Raycaster()
		// 鼠标位置
		this.mouse = new THREE.Vector2()
		// 辉光效果合成器
		this.glowComposer
		this.glowRenderPass
		// 辉光渲染器
		this.unrealBloomPass
		// 辉光着色器
		this.shaderPass
		// 需要辉光的材质
		this.glowMaterialList
		this.materials = {}
		// 拖拽对象控制器
		this.transformControls
		// 是否开启辉光
		this.glowUnrealBloomPass = false
		// 窗口变化监听事件
		this.onWindowResizesListener
		// 鼠标点击事件
		this.onMouseClickListener
		// 模型上传进度条回调函数
		this.modelProgressCallback = (e) => e
		// 当前拖拽的几何模型
		this.dragGeometryModel = {}
		// 当前模型加载状态
		this.loadingStatus = true
	}
	init() {
		return new Promise(async (reslove, reject) => {
			//初始化渲染器
			this.initRender()
			//初始化相机
			this.initCamera()
			//初始化场景
			this.initScene()
			//初始化控制器，控制摄像头,控制器一定要在渲染器后
			this.initControls()
			// 创建辅助线
			this.createHelper()
			// 创建灯光
			this.createLight()
			this.addEvenListMouseLisatener()
			// 添加物体模型 TODO：初始化时需要默认一个
			// https://images.wanjunshijie.com/demo/threeDemo2/glb/city.glb
			//  https://threejs.org/examples/models/gltf/LittlestTokyo.glb
			const load = await this.setModel({ filePath: 'threeFile/glb/glb-9.glb', fileType: 'glb', decomposeName: 'transformers_3' })
			// 创建效果合成器
			this.createEffectComposer()
			//场景渲染
			this.sceneAnimation()
			reslove(load)
		})
	}
	// 创建场景
	async initScene() {
		this.scene = new THREE.Scene()
		const texture = new THREE.TextureLoader().load(require('@/assets/image/view-4.png'))
		texture.mapping = THREE.EquirectangularReflectionMapping
		this.scene.background = texture
		this.scene.environment = texture
		this.scene.backgroundIntensity = 1
		this.scene.backgroundBlurriness = 1
		texture.dispose()
	}
	// 创建相机
	initCamera() {
		const { clientHeight, clientWidth } = this.container
		this.camera = new THREE.PerspectiveCamera(50, clientWidth / clientHeight, 0.25, 2000)
	}
	// 创建渲染器
	initRender() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }) //设置抗锯齿
		//设置屏幕像素比
		this.renderer.setPixelRatio(window.devicePixelRatio)
		//渲染的尺寸大小
		const { clientHeight, clientWidth } = this.container
		this.renderer.setSize(clientWidth, clientHeight)
		//色调映射
		// this.renderer.toneMapping = THREE.ACESFilmicToneMapping
		this.renderer.toneMapping = THREE.ReinhardToneMapping
		this.renderer.autoClear = true
		this.renderer.outputColorSpace = THREE.SRGBColorSpace
		//曝光
		this.renderer.toneMappingExposure = 2
		this.renderer.shadowMap.enabled = true
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
		this.container.appendChild(this.renderer.domElement)
	}
	// 更新场景
	sceneAnimation() {
		this.renderAnimation = requestAnimationFrame(() => this.sceneAnimation())
		// 等模型加载和相关数据处理完成在执行
		if (this.loadingStatus) {
			//辉光效果开关开启时执行
			if (this.glowUnrealBloomPass) {
				// 将不需要处理辉光的材质进行存储备份
				this.setMeshFlow()
			} else {
				this.effectComposer.render()
				this.controls.update()
			}
			TWEEN.update();
		}
	}
	// 监听事件
	addEvenListMouseLisatener() {
		//监听场景大小改变，跳转渲染尺寸
		this.onWindowResizesListener = this.onWindowResizes.bind(this)
		window.addEventListener("resize", this.onWindowResizesListener)
		// 鼠标点击
		this.onMouseClickListener = this.onMouseClickModel.bind(this)
		this.container.addEventListener('click', this.onMouseClickListener)
	}
	// 创建控制器
	initControls() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement)
		this.controls.enablePan = false
		this.controls.enableDamping = true;
		this.controls.target.set(0, 0, 0);
		this.controls.update()
	}
	// 加载模型
	setModel({ filePath, fileType, decomposeName }) {
		return new Promise((resolve, reject) => {
			this.loadingStatus = false
			const THREE_PATH = `https://unpkg.com/three@0.${THREE.REVISION}.x`;
			let loader
			if (['glb', 'gltf'].includes(fileType)) {
				const dracoLoader = new DRACOLoader()
				dracoLoader.setDecoderPath(`draco/gltf/`)
				dracoLoader.setDecoderConfig({ type: 'js' })
				dracoLoader.preload()
				loader = new GLTFLoader().setDRACOLoader(dracoLoader)
			} else {
				loader = this.fileLoaderMap[fileType]
			}
			loader.load(filePath, (result) => {
				switch (fileType) {
					case 'glb':
						this.model = result.scene
						this.skeletonHelper = new THREE.SkeletonHelper(result.scene)
						break;
					case 'fbx':
						this.model = result
						this.skeletonHelper = new THREE.SkeletonHelper(result)
						break;
					case 'gltf':
						this.model = result.scene
						this.skeletonHelper = new THREE.SkeletonHelper(result.scene)
						break;
					case 'obj':
						this.model = result
						this.skeletonHelper = new THREE.SkeletonHelper(result)
						break;
					case 'stl':
						const material = new THREE.MeshStandardMaterial();
						const mesh = new THREE.Mesh(result, material);
						this.model = mesh
						break;
					default:
						break;
				}
				this.model.decomposeName = decomposeName
				this.getModelMeaterialList()
				this.setModelPositionSize()
				this.skeletonHelper.visible = false
				this.scene.add(this.skeletonHelper)
				// 需要辉光的材质
				this.glowMaterialList = this.modelMaterialList.map(v => v.name)
				this.scene.add(this.model)
				this.loadingStatus = true
				resolve(true)
				this.getModelAnimaionList(result)

			}, (xhr) => {
				this.modelProgressCallback(xhr.loaded)
			}, (err) => {
				ElMessage.error('文件错误')
				console.log(err)
				resolve(true)
			})

		})
	}
	// 设置材质辉光
	setMeshFlow() {
		this.scene.traverse((v) => {
			if (v instanceof THREE.GridHelper) {
				this.materials.gridHelper = v.material
				v.material = new THREE.MeshStandardMaterial({ color: '#000' })
			}
			if (v instanceof THREE.Scene) {
				this.materials.scene = v.background
				this.materials.environment = v.environment
				v.background = null
				v.environment = null
			}
			if (!this.glowMaterialList.includes(v.name) && v.isMesh) {
				this.materials[v.uuid] = v.material
				v.material = new THREE.MeshStandardMaterial({ color: '#000' })
			}
		})
		this.glowComposer.render()
		// 辉光渲染器执行完之后在恢复材质原效果
		this.scene.traverse((v) => {
			if (this.materials[v.uuid]) {
				v.material = this.materials[v.uuid]
				delete this.materials[v.uuid]
			}
			if (v instanceof THREE.GridHelper) {
				v.material = this.materials.gridHelper
				delete this.materials.gridHelper
			}
			if (v instanceof THREE.Scene) {
				v.background = this.materials.scene
				v.environment = this.materials.environment
				delete this.materials.scene
				delete this.materials.environment
			}
		})
		this.effectComposer.render()
		this.controls.update()

	}
	// 加载几何体模型
	setGeometryModel(model) {
		return new Promise((reslove, reject) => {
			const { clientHeight, clientWidth, offsetLeft, offsetTop } = this.container
			// 计算鼠标在屏幕上的坐标
			this.mouse.x = ((model.clientX - offsetLeft) / clientWidth) * 2 - 1
			this.mouse.y = -((model.clientY - offsetTop) / clientHeight) * 2 + 1
			this.raycaster.setFromCamera(this.mouse, this.camera);
			const intersects = this.raycaster.intersectObjects(this.scene.children, true);
			if (intersects.length > 0) {
				// 在控制台输出鼠标在场景中的位置
				const { type } = model
				// 不需要赋值的key
				const notGeometrykey = ['id', 'name', 'modelType', 'type']
				const geometryData = Object.keys(model).filter(key => !notGeometrykey.includes(key)).map(v => model[v])
				// 创建几何体
				const geometry = new THREE[type](...geometryData)
				const colors = ['#FF4500', '#90EE90', '#00CED1', '#1E90FF', '#C71585', '#FF4500', '#FAD400', '#1F93FF', '#90F090', '#C71585']
				// 随机颜色
				const meshColor = colors[Math.ceil(Math.random() * 10)]
				const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(meshColor), side: THREE.DoubleSide })
				const mesh = new THREE.Mesh(geometry, material)
				const { x, y, z } = intersects[0].point
				mesh.position.set(x, y, z)

				const newMesh = mesh.clone()
				Object.assign(mesh.userData, {
					rotation: newMesh.rotation,
					scale: newMesh.scale,
					position: newMesh.position,
				})

				mesh.name = type + '_' + onlyKey(4, 5)
				mesh.userData.geometry = true
				this.geometryGroup.add(mesh)
				this.model = this.geometryGroup
				this.onSetGeometryMeshList(mesh)
				this.skeletonHelper.visible = false
				this.skeletonHelper.dispose()
				this.glowMaterialList = this.modelMaterialList.map(v => v.name)
				this.setModelMeshDrag({ transformType: true })
				this.scene.add(this.model)
				//计算控制器缩放大小
				const box = new THREE.Box3().setFromObject(this.model);
				const size = box.getSize(new THREE.Vector3());
				this.controls.maxDistance = size.length() * 10
				this.loadingStatus = true
				reslove(true)
			} else {
				ElMessage.warning('当前角度无法获取鼠标位置请调整“相机角度”在添加')
			}

		})

	}
	// 模型加载进度条回调函数
	onProgress(callback) {
		if (typeof callback == 'function') {
			this.modelProgressCallback = callback
		}
	}
	// 创建辅助线
	createHelper() {
		//网格辅助线
		this.gridHelper = new THREE.GridHelper(6, 18, '#fff', 'rgb(193,193,193)');
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
		this.ambientLight.visible = true
		this.scene.add(this.ambientLight)
		// 创建平行光
		this.directionalLight = new THREE.DirectionalLight('#fff', 5)
		this.directionalLight.position.set(-1.44, 2.2, 1)
		this.directionalLight.castShadow = true
		this.directionalLight.visible = false
		this.scene.add(this.directionalLight)
		// 创建平行光辅助线
		this.directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight, .3)
		this.directionalLightHelper.visible = false
		this.scene.add(this.directionalLightHelper)

		// 创建点光源
		this.pointLight = new THREE.PointLight(0xff0000, 5, 100)
		this.pointLight.visible = false
		this.scene.add(this.pointLight)
		// 创建点光源辅助线
		this.pointLightHelper = new THREE.PointLightHelper(this.pointLight, .5)
		this.pointLightHelper.visible = false
		this.scene.add(this.pointLightHelper)

		//  创建聚光灯
		this.spotLight = new THREE.SpotLight('#00BABD', 900);
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
		var groundMaterial = new THREE.MeshStandardMaterial({ color: '#000000' });
		this.planeGeometry = new THREE.Mesh(geometry, groundMaterial);
		this.planeGeometry.rotation.x = -Math.PI / 2
		this.planeGeometry.position.set(0, -1.2, 0)

		// 让地面接收阴影
		this.planeGeometry.receiveShadow = true;
		this.planeGeometry.visible = false
		this.scene.add(this.planeGeometry);
	}
	// 创建效果合成器
	createEffectComposer() {
		if (!this.container) return false
		const { clientHeight, clientWidth } = this.container
		this.effectComposer = new EffectComposer(this.renderer, new THREE.WebGLRenderTarget(clientWidth, clientHeight))
		const renderPass = new RenderPass(this.scene, this.camera)
		this.effectComposer.addPass(renderPass)
		this.outlinePass = new OutlinePass(new THREE.Vector2(clientWidth, clientHeight), this.model, this.camera)
		this.outlinePass.visibleEdgeColor = new THREE.Color('#FF8C00') // 可见边缘的颜色
		this.outlinePass.hiddenEdgeColor = new THREE.Color('#8a90f3') // 不可见边缘的颜色
		this.outlinePass.edgeGlow = 2 // 发光强度
		this.outlinePass.usePatternTexture = false // 是否使用纹理图案
		this.outlinePass.edgeThickness = 1 // 边缘浓度
		this.outlinePass.edgeStrength = 4 // 边缘的强度，值越高边框范围越大
		this.outlinePass.pulsePeriod = 200 // 闪烁频率，值越大频率越低
		this.effectComposer.addPass(this.outlinePass)
		let outputPass = new OutputPass()
		this.effectComposer.addPass(outputPass)


		let effectFXAA = new ShaderPass(FXAAShader)
		const pixelRatio = this.renderer.getPixelRatio()
		effectFXAA.uniforms.resolution.value.set(1 / (clientWidth * pixelRatio), 1 / (clientHeight * pixelRatio))
		effectFXAA.renderToScreen = true
		effectFXAA.needsSwap = true
		this.effectComposer.addPass(effectFXAA)

		//创建辉光效果
		this.unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(clientWidth, clientHeight), 1.5, 0.4, 0.85)
		// 辉光合成器
		const renderTargetParameters = {
			minFilter: THREE.LinearFilter,
			format: THREE.RGBAFormat,
			stencilBuffer: false,
		};
		const glowRender = new THREE.WebGLRenderTarget(clientWidth * 2, clientHeight * 2, renderTargetParameters)
		this.glowComposer = new EffectComposer(this.renderer, glowRender)
		this.glowComposer.renderToScreen = false
		this.glowRenderPass = new RenderPass(this.scene, this.camera)
		this.glowComposer.addPass(this.glowRenderPass)
		this.glowComposer.addPass(this.unrealBloomPass)
		// 着色器
		this.shaderPass = new ShaderPass(new THREE.ShaderMaterial({
			uniforms: {
				baseTexture: { value: null },
				bloomTexture: { value: this.glowComposer.renderTarget2.texture },
				tDiffuse: { value: null },
				glowColor: { value: null }
			},
			vertexShader,
			fragmentShader,
			defines: {}
		}), 'baseTexture')

		this.shaderPass.material.uniforms.glowColor.value = new THREE.Color();
		this.shaderPass.renderToScreen = true
		this.shaderPass.needsSwap = true
		this.shaderPass.name = 'ShaderColor'
	}
	// 切换模型
	onSwitchModel(model) {
		return new Promise(async (reslove, reject) => {
			try {
				// 加载几何模型
				if (model.modelType && model.modelType == 'geometry') {
					// 重置"灯光"模块数据
					this.modelAnimation = []
					this.camera.fov = 80
					this.camera.updateProjectionMatrix()
					const load = await this.setGeometryModel(model)
					this.outlinePass.renderScene = this.geometryGroup
					reslove()
				} else {
					this.clearSceneModel()
					// 重置"灯光"模块数据
					this.onResettingLight({ ambientLight: true })
					this.camera.fov = 50
					this.geometryGroup.clear()
					// 加载模型
					const load = await this.setModel(model)
					this.outlinePass.renderScene = this.model
					// 模型加载成功返回 true
					reslove({ load, filePath: model.filePath })
				}
			} catch {
				reject()
			}
		})
	}

	// 监听窗口变化
	onWindowResizes() {
		if (!this.container) return false
		const { clientHeight, clientWidth } = this.container
		//调整屏幕大小
		this.camera.aspect = clientWidth / clientHeight // 摄像机宽高比例
		this.camera.updateProjectionMatrix() //相机更新矩阵，将3d内容投射到2d面上转换
		this.renderer.setSize(clientWidth, clientHeight)
		if (this.effectComposer) this.effectComposer.setSize(clientWidth * 2, clientHeight * 2)
		if (this.glowComposer) this.glowComposer.setSize(clientWidth, clientHeight)
	}
	// 下载场景封面
	onDownloadScenCover() {
		var link = document.createElement('a');
		var canvas = this.renderer.domElement;
		link.href = canvas.toDataURL("image/png");
		link.download = `${new Date().toLocaleString()}.png`
		link.click();
		ElMessage.success('下载成功')
	}
	// 导出模型
	onExporterModel(type) {
		const exporter = new GLTFExporter();
		const options = {
			trs: true,      // 是否保留位置、旋转、缩放信息
			animations: this.modelAnimation, // 导出的动画
			binary: type == 'glb' ? true : false,  // 是否以二进制格式输出
			embedImages: true,//是否嵌入贴图
			onlyVisible: true, //是否只导出可见物体
			includeCustomExtensions: true,
		}
		exporter.parse(this.scene, function (result) {
			if (result instanceof ArrayBuffer) {
				// 将结果保存为GLB二进制文件
				saveArrayBuffer(result, `${new Date().toLocaleString()}.glb`);

			} else {
				// 将结果保存为GLTF JSON文件
				saveString(JSON.stringify(result), `${new Date().toLocaleString()}.gltf`);
			}
			function saveArrayBuffer(buffer, filename) {
				// 将二进制数据保存为文件
				const blob = new Blob([buffer], { type: 'application/octet-stream' });
				const url = URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = filename;
				link.click();
				URL.revokeObjectURL(url);
				ElMessage.success('导出成功')
			}
			function saveString(text, filename) {
				// 将字符串数据保存为文件
				const blob = new Blob([text], { type: 'application/json' });
				const url = URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = filename;
				link.click();
				URL.revokeObjectURL(url);
				ElMessage.success('导出成功')
			}
		}, (err) => {
			ElMessage.error(err)
		}, options);
	}
	// 清除模型数据
	onClearModelData() {
		cancelAnimationFrame(this.rotationAnimationFrame)
		cancelAnimationFrame(this.renderAnimation)
		cancelAnimationFrame(this.animationFrame)
		this.container.removeEventListener('click', this.onMouseClickListener)
		window.removeEventListener("resize", this.onWindowResizesListener)
		this.scene.traverse((v) => {
			if (v.type === 'Mesh') {
				v.geometry.dispose();
				v.material.dispose();
			}
		})
		this.scene.clear()
		this.renderer.dispose()
		this.renderer.clear()
		this.container = null
		// 相机
		this.camera = null
		// 场景
		this.scene = null
		//渲染器
		this.renderer = null
		// 控制器
		this.controls = null
		// 模型
		this.model = null
		//几何体模型
		this.geometryModel = null
		//文件加载器类型
		this.fileLoaderMap = null
		//模型动画列表
		this.modelAnimation = null
		//模型动画对象
		this.animationMixer = null
		this.animationColock = null
		//动画帧
		this.animationFrame = null
		// 轴动画帧
		this.rotationAnimationFrame = null
		// 动画构造器
		this.animateClipAction = null
		// 动画循环方式枚举
		this.loopMap = null
		// 模型骨架
		this.skeletonHelper = null
		// 网格辅助线
		this.gridHelper = null
		// 坐标轴辅助线
		this.axesHelper = null
		// 环境光
		this.ambientLight = null
		//平行光
		this.directionalLight = null
		// 平行光辅助线
		this.directionalLightHelper = null
		// 点光源
		this.pointLight = null
		//点光源辅助线
		this.pointLightHelper = null
		//聚光灯
		this.spotLight = null
		//聚光灯辅助线
		this.spotLightHelper = null
		//模型平面
		this.planeGeometry = null
		//模型材质列表
		this.modelMaterialList = []
		this.originalMaterials.clear()
		// 效果合成器
		this.effectComposer = null
		this.outlinePass = null
		// 动画渲染器
		this.renderAnimation = null
		// 碰撞检测
		this.raycaster = null
		// 鼠标位置
		this.mouse = null
		// 辉光效果合成器
		if (this.glowComposer) {
			this.glowComposer.renderer.clear()
			this.glowComposer.renderer.dispose()
		}
		this.glowComposer = null
		// 辉光渲染器
		this.unrealBloomPass = null
		//辉光着色器
		this.shaderPass = null
		// 需要辉光的材质
		this.glowMaterialList = null
		this.materials = null
		// 拖拽对象控制器
		this.transformControls = null
		this.dragGeometryModel = null
		this.glowUnrealBloomPass = false

	}


	/**
	 * @describe 左侧面板操作方法
	 * @function clearSceneModel 清除场景模型数据
	 * @function setDragGeometryModel 设置当前被拖拽的几何模型
	 */

	// 清除场景模型数据
	clearSceneModel() {
		//先移除模型 材质释放内存
		this.scene.traverse((v) => {
			if (v.type === 'Mesh') {
				v.geometry.dispose();
				v.material.dispose();
			}
		})
		this.dragGeometryModel = {}
		//取消动画帧
		cancelAnimationFrame(this.animationFrame)
		cancelAnimationFrame(this.rotationAnimationFrame)
		this.scene.remove(this.model)
		this.model = null
		this.glowUnrealBloomPass = false
		this.glowMaterialList = []
		this.modelMaterialList = []
		this.originalMaterials.clear()
		this.materials = {}
		if (this.transformControls) {
			this.transformControls.detach()
			this.transformControls.dispose()
			this.scene.remove(this.transformControls)
			this.transformControls = null
		}
		if (this.glowComposer) {
			this.glowComposer.renderer.clear()
			this.glowComposer.renderer.dispose()
		}
		if (this.effectComposer) {
			this.effectComposer.removePass(this.shaderPass)
		}
		this.renderer.toneMappingExposure = 2
		this.outlinePass.selectedObjects = []
		Object.assign(this.unrealBloomPass, {
			threshold: 0,
			strength: 0,
			radius: 0,
		})
		this.shaderPass.material.uniforms.glowColor.value = new THREE.Color()
		// 重置"辅助线/轴配置"模块数据
		this.skeletonHelper.visible = false
		const config = {
			gridHelper: false,
			x: 0,
			y: -0.59,
			z: -0.1,
			positionX: 0,
			positionY: -1,
			positionZ: 0,
			divisions: 18,
			size: 6,
			color: "rgb(193,193,193)",
			axesHelper: false,
			axesSize: 1.8,
		}
		this.onResettingLight({ ambientLight: false })
		this.onSetModelGridHelper(config)
		this.onSetModelGridHelperSize(config)
		this.onSetModelAxesHelper(config)
	}
	// 设置当前被拖拽的几何模型
	setDragGeometryModel(model) {
		this.dragGeometryModel = model
	}



}

Object.assign(renderModel.prototype, {
	...modulesPrototype
})


export default renderModel