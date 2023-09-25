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
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter'
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { ElMessage } from 'element-plus';
import { lightPosition, onlyKey } from '@/utils/utilityFunction'
import store from '@/store'
import TWEEN from "@tweenjs/tween.js";
import { vertexShader, fragmentShader, MODEL_DECOMPOSE } from '@/config/constant.js'
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
		this.modelMaterialList
		// 效果合成器
		this.effectComposer
		this.outlinePass
		// 动画渲染器
		this.renderAnimation = null
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
			const load = await this.setModel({ filePath: 'threeFile/glb/glb-9.glb', fileType: 'glb', decomposeName: 'transformers_3' })
			// 创建效果合成器
			this.createEffectComposer()
			//场景渲染
			this.sceneAnimation()
			reslove(load)
		})
	}
	// 创建场景
	initScene() {
		this.scene = new THREE.Scene()
		const texture = new THREE.TextureLoader().load(require('@/assets/image/view-4.png'))
		texture.mapping = THREE.EquirectangularReflectionMapping
		this.scene.background = texture
		this.scene.environment = texture
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
		this.renderer.toneMapping = THREE.ReinhardToneMapping
		this.renderer.autoClear = true
		this.renderer.outputColorSpace = THREE.SRGBColorSpace
		//曝光
		this.renderer.toneMappingExposure = 3
		this.renderer.shadowMap.enabled = true
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
		this.container.appendChild(this.renderer.domElement)
	}
	// 更新场景
	sceneAnimation() {
		this.renderAnimation = requestAnimationFrame(() => this.sceneAnimation())
		// 将不需要处理辉光的材质进行存储备份
		this.scene.traverse((v) => {
			if (v instanceof THREE.Scene) {
				this.materials.scene = v.background
				v.background = null
			}
			if (!this.glowMaterialList.includes(v.name) && v.isMesh) {
				this.materials[v.uuid] = v.material
				v.material = new THREE.MeshStandardMaterial({ color: 'black' })
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
		this.controls.update()
		TWEEN.update();
		this.effectComposer.render()
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
	}
	// 加载模型
	setModel({ filePath, fileType, scale, map, position, decomposeName }) {
		return new Promise((resolve, reject) => {
			const loader = this.fileLoaderMap[fileType]
			if (['glb', 'gltf'].includes(fileType)) {
				const dracoLoader = new DRACOLoader()
				dracoLoader.setDecoderPath('./threeFile/gltf/')
				loader.setDRACOLoader(dracoLoader)
			}
			loader.load(filePath, (result) => {
				switch (fileType) {
					case 'glb':
						this.model = result.scene
						this.skeletonHelper = new THREE.SkeletonHelper(result.scene)
						this.modelAnimation = result.animations || []
						break;
					case 'fbx':
						this.model = result
						this.skeletonHelper = new THREE.SkeletonHelper(result)
						this.modelAnimation = result.animations || []
						break;
					case 'gltf':
						this.model = result.scene
						this.skeletonHelper = new THREE.SkeletonHelper(result.scene)
						this.modelAnimation = result.animations || []
						break;
					case 'obj':
						this.model = result
						this.skeletonHelper = new THREE.SkeletonHelper(result)
						this.modelAnimation = result.animations || []
						break;
					default:
						break;
				}
				this.model.decomposeName = decomposeName
				this.getModelMeaterialList(map)
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
				// 需要辉光的材质
				this.glowMaterialList = this.modelMaterialList.map(v => v.name)
				this.scene.add(this.model)
				resolve(true)
			}, (xhr) => {
				this.modelProgressCallback(xhr.loaded)
			}, (err) => {
				ElMessage.error('文件错误')
				console.log(err)
				reject()
			})
		})
	}

	// 加载几何体模型
	setGeometryModel(model) {
		return new Promise((reslove, reject) => {
			const { clientHeight, clientWidth, offsetLeft, offsetTop } = this.container
			// 计算鼠标在屏幕上的坐标
			this.mouse.x = ((model.clientX - offsetLeft) / clientWidth) * 2 - 1
			this.mouse.y = -((model.clientY - offsetTop) / clientHeight) * 2 + 1
			this.raycaster.setFromCamera(this.mouse, this.camera);
			const intersects = this.raycaster.intersectObjects(this.scene.children);

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
				const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(meshColor),side: THREE.DoubleSide })
				const mesh = new THREE.Mesh(geometry, material)
				const { x, y, z } = intersects[0].point
				mesh.position.set(x, y, z)
				mesh.name = type + '_' + onlyKey(4, 5)
				mesh.userData.geometry = true
				this.geometryGroup.add(mesh)
				this.model = this.geometryGroup
				this.onSetGeometryMeshList(mesh)
				this.skeletonHelper.visible = false
				this.skeletonHelper.dispose()
				this.glowMaterialList = this.modelMaterialList.map(v => v.name)
				this.setModelMeshDrag({ modelDrag: true })
				this.scene.add(this.model)
			}
			reslove(true)

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
		this.planeGeometry.name = 'planeGeometry'
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
		this.outlinePass.visibleEdgeColor = new THREE.Color('#FF8C00') // 可见边缘的颜色
		this.outlinePass.hiddenEdgeColor = new THREE.Color('#8a90f3') // 不可见边缘的颜色
		this.outlinePass.edgeGlow = 2.0 // 发光强度
		//this.outlinePass.usePatternTexture = false // 是否使用纹理图案
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
		this.unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(clientWidth, clientHeight),1.5, 0.4, 0.85)
		// this.unrealBloomPass.threshold = 0
		// this.unrealBloomPass.strength = 0
		// this.unrealBloomPass.radius = 0
		// this.unrealBloomPass.renderToScreen = true
		// 辉光合成器
		const renderTargetParameters = {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			format: THREE.RGBAFormat,
			stencilBuffer: false,
		};
		const glowRender = new THREE.WebGLRenderTarget(clientWidth * 2, clientHeight * 2, renderTargetParameters)
		this.glowComposer = new EffectComposer(this.renderer,glowRender)
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
	// 切换模型
	onSwitchModel(model) {
		return new Promise(async (reslove, reject) => {
			try {
				this.clearSceneModel()
				// 加载几何模型
				if (model.modelType && model.modelType == 'geometry') {
					// 重置"灯光"模块数据
					this.onResettingLight({ ambientLight: false })
					this.modelAnimation = []
					this.camera.fov = 80
					this.camera.updateProjectionMatrix()
					const load = await this.setGeometryModel(model)
					reslove()
				} else {
					// 重置"灯光"模块数据
					this.onResettingLight({ ambientLight: true })
					this.camera.fov = 50
					this.geometryGroup.clear()
					// 加载模型
					const load = await this.setModel(model)
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
		this.camera.aspect = clientWidth / clientHeight //摄像机宽高比例
		this.camera.updateProjectionMatrix() //相机更新矩阵，将3d内容投射到2d面上转换
		this.renderer.setSize(clientWidth, clientHeight)
		this.effectComposer.setSize(clientWidth * 2, clientHeight * 2)
		this.glowComposer.setSize(clientWidth, clientHeight)
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
		this.modelMaterialList = null
		// 效果合成器
		this.effectComposer = null
		this.outlinePass = null
		// 动画渲染器
		this.renderAnimation = null
		// 碰撞检测
		this.raycaster == null
		// 鼠标位置
		this.mouse = null
		// 模型自带贴图
		this.modelTextureMap = null
		// 辉光效果合成器
		this.glowComposer = null
		// 辉光渲染器
		this.unrealBloomPass = null
		// 需要辉光的材质
		this.glowMaterialList = null
		this.materials = null
		// 拖拽对象控制器
		this.dragControls = null
		this.dragGeometryModel = null
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
		this.modelTextureMap = []
		this.glowMaterialList = []
		this.materials = {}
		if (this.dragControls) {
			this.dragControls.dispose()
		}
		this.renderer.toneMappingExposure = 3
		Object.assign(this.unrealBloomPass, {
			threshold: 0,
			strength: 0,
			radius: 0,
		})

		// 重置"辅助线/轴配置"模块数据
		this.skeletonHelper.visible = false
		const config = {
			gridHelper: false,
			x: 0,
			y: -0.59,
			z: -0.1,
			positionX: 0,
			positionY: -0.5,
			positionZ: 0,
			divisions: 10,
			size: 4,
			color: "rgb(193,193,193)",
			axesHelper: false,
			axesSize: 1.8,
		}
		this.onSetModelGridHelper(config)
		this.onSetModelGridHelperSize(config)
		this.onSetModelAxesHelper(config)
	}
	// 设置当前被拖拽的几何模型
	setDragGeometryModel(model) {
		this.dragGeometryModel = model
	}

	/**
	 * @describe 背景模块方法
	 * @function onSetSceneColor 设置场景颜色
	 * @function onSetSceneImage 设置场景图片
	 * @function onSetSceneViewImage 设置全景图
	 */
	// 设置场景颜色
	onSetSceneColor(color) {
		this.scene.background = new THREE.Color(color)
	}
	// 设置场景图片
	onSetSceneImage(url) {
		this.scene.background = new THREE.TextureLoader().load(url);
	}
	// 设置全景图
	onSetSceneViewImage(url) {
		const texture = new THREE.TextureLoader().load(url);
		texture.mapping = THREE.EquirectangularReflectionMapping
		this.scene.background = texture
		this.scene.environment = texture
	}



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
					const { name, color, map, depthWrite, wireframe, opacity } = v.material
					// 统一将模型材质 设置为 MeshLambertMaterial 类型
					v.material = new THREE.MeshStandardMaterial({
						map,
						transparent: true,
						color,
						// wireframe,
						// depthWrite,
						opacity,
						name,
					})
					this.modelMaterialList.push(v)
					// 获取模型自动材质贴图
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
				}
				// 部分模型本身没有贴图需 要单独处理
				if (v.material && isMap) {
					const mapTexture = new THREE.TextureLoader().load(map)
					const { color, name, depthWrite, wireframe, opacity } = v.material
					v.material = new THREE.MeshStandardMaterial({
						map: mapTexture,
						name,
						transparent: true,
						color,
						// wireframe,
						// depthWrite,
						opacity,
					})
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
	// 设置材质属性
	onSetModelMaterial(config) {
		const { color, wireframe, depthWrite, opacity } = JSON.parse(JSON.stringify(config))
		const uuid = store.state.selectMesh.uuid
		const mesh = this.scene.getObjectByProperty('uuid', uuid)
		if (mesh && mesh.material) {
			const { name, map } = mesh.material
			mesh.material = new THREE.MeshStandardMaterial({
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
	onSetModelMap({ material, mapId, meshName }) {
		const uuid = store.state.selectMesh.uuid
		const mesh = this.scene.getObjectByProperty('uuid', uuid)
		const { name, color } = mesh.material
		mesh.material = new THREE.MeshStandardMaterial({
			map: material.map,
			transparent: true,
			color,
			name,
		})
		mesh.mapId = mapId
		// 设置当前材质来源唯一标记值key 用于预览处数据回填需要
		mesh.meshFrom = meshName
	}
	// 设置模型贴图（系统贴图）
	onSetSystemModelMap({ id, url }) {
		const uuid = store.state.selectMesh.uuid
		const mesh = this.scene.getObjectByProperty('uuid', uuid)
		const { name, color } = mesh.material
		const mapTexture = new THREE.TextureLoader().load(url)
		mesh.material = new THREE.MeshStandardMaterial({
			map: mapTexture,
			transparent: true,
			color,
			name,
		})
		mesh.mapId = id
		// 设置当前材质来源唯一标记值key 用于预览处数据回填需要
		mesh.meshFrom = id
	}
	// 选择材质
	onChangeModelMeaterial(name) {
		const mesh = this.model.getObjectByName(name)
		this.outlinePass.selectedObjects = [mesh]
		store.commit('SELECT_MESH', mesh)
		return mesh
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
	// 获取最新材质信息列表
	onGetEditMeshList() {
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
	onChangeModelMeshType(activeMesh) {
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
	onSetGeometryMeshList(v) {
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
				const { url, mapId } = this.getModelMaps(materials, uuid)
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


	/**
	 * @describe 后期/操作模块方法
	 * @function onSetUnrealBloomPass 设置辉光效果
	 * @function setModelMeshDecompose 模型拆分
	 * @function setModelMeshDrag 模型材质可拖拽
	 * @function getMeshDragPosition 获取模型材质位拖拽置
	 */
	// 设置辉光效果
	onSetUnrealBloomPass(config) {
		const { glow, threshold, strength, radius, toneMappingExposure } = config
		this.glowUnrealBloomPass = glow
		if (glow) {
			this.unrealBloomPass.threshold = threshold
			this.unrealBloomPass.strength = strength
			this.unrealBloomPass.radius = radius
			this.renderer.toneMappingExposure = toneMappingExposure

		} else {
			this.unrealBloomPass.threshold = 0
			this.unrealBloomPass.strength = 0
			this.unrealBloomPass.radius = 0
			this.renderer.toneMappingExposure = toneMappingExposure
		}
	}
	// 模型拆分
	setModelMeshDecompose({ decompose }) {
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
	setModelMeshDrag({ modelDrag }) {
		if (modelDrag) {
			this.dragControls = new DragControls(this.modelMaterialList, this.camera, this.renderer.domElement);
			// 拖拽事件监听
			this.dragControls.addEventListener('dragstart', () => {
				this.controls.enabled = false
			})

			this.dragControls.addEventListener('dragend', () => {
				this.controls.enabled = true
			})

		} else {
			
			if (this.dragControls) this.dragControls.dispose()
		}
	}

	// 获取模型材质位拖拽置
	getMeshDragPosition() {
		const positonList = []
		this.modelMaterialList.forEach(v => {
			const mesh = this.model.getObjectByProperty('name', v.name)
			const obj = {
				name: v.name,
				...mesh.position
			}
			positonList.push(obj)
		})
		return positonList
	}



	/**
	 * @describe 灯光模块方法
	 * @function onSetModelAmbientLight 设置环境光
	 * @function onSetModelDirectionalLight 设置平行光
	 * @function onSetModelPointLight 设置点光源
	 * @function onSetModelSpotLight 设置聚光灯
	 * @function onSetModelPlaneGeometry 设置模型平面
	 * @function onResettingLight 重置场景灯光
	 */
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
	// 重置场景灯光
	onResettingLight({ ambientLight }) {
		const config = {
			planeGeometry: false,
			planeColor: "#939393",
			planeWidth: 7,
			planeHeight: 7,
			//环境光
			ambientLight,
			ambientLightColor: "#fff",
			ambientLightIntensity: 0.8,
			//平行光
			directionalLight: false,
			directionalLightHelper: true,
			directionalLightColor: "#1E90FF",
			directionalLightIntensity: 1,
			directionalHorizontal: -1.26,
			directionalVertical: -3.85,
			directionalSistance: 2.98,
			directionaShadow: true,
			//点光源
			pointLight: false,
			pointLightHelper: true,
			pointLightColor: "#1E90FF",
			pointLightIntensity: 1,
			pointHorizontal: -4.21,
			pointVertical: -4.1,
			pointSistance: 2.53,
			//聚光灯
			spotLight: false,
			spotLightColor: "#323636",
			spotLightIntensity: 400,
			spotHorizontal: -3.49,
			spotVertical: -4.37,
			spotSistance: 4.09,
			spotAngle: 0.5,
			spotPenumbra: 1,
			spotFocus: 1,
			spotCastShadow: true,
			spotLightHelper: true,
			spotDistance: 20
		}
		this.onSetModelAmbientLight(config)
		this.onSetModelDirectionalLight(config)
		this.onSetModelPointLight(config)
		this.onSetModelSpotLight(config)
		this.onSetModelPlaneGeometry(config)
	}


	/**
	 * @describe 模型动画模块方法
	 * @function onStartModelAnimaion 开始执行动画
	 * @function onSetModelAnimaion 设置模型动画
	 * @function animationFrameFun 动画帧
	 * @function onClearAnimation 清除动画
	 * @function onSetRotation 设置模型轴动画
	 * @function onSetRotationType 设置模型轴动画类型
	 */
	// 开始执行动画
	onStartModelAnimaion(config) {
		this.onSetModelAnimaion(config)
		cancelAnimationFrame(this.animationFrame)
		this.animationFrameFun()
	}
	// 设置模型动画
	onSetModelAnimaion({ animationName, loop, timeScale, weight }) {
		this.animationMixer = new THREE.AnimationMixer(this.model)
		const clip = THREE.AnimationClip.findByName(this.modelAnimation, animationName)
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
		this.animationFrame = requestAnimationFrame(() => this.animationFrameFun())
		if (this.animationMixer) {
			this.animationMixer.update(this.animationColock.getDelta())
		}
	}
	// 清除动画
	onClearAnimation() {
		if (!this.animateClipAction) return
		this.animationMixer.stopAllAction();
		this.animationMixer.update(0);
		cancelAnimationFrame(this.animationFrame)
	}
	// 设置模型轴动画
	onSetRotation(config) {
		const { rotationVisible, rotationType, rotationSpeed } = config
		if (rotationVisible) {
			cancelAnimationFrame(this.rotationAnimationFrame)
			this.rotationAnimationFun(rotationType, rotationSpeed)
		} else {
			cancelAnimationFrame(this.rotationAnimationFrame)
			this.model.rotation.set(0, 0, 0)
		}
	}
	// 设置轴动画类型
	onSetRotationType(config) {
		const { rotationType, rotationSpeed } = config
		this.model.rotation.set(0, 0, 0)
		cancelAnimationFrame(this.rotationAnimationFrame)
		this.rotationAnimationFun(rotationType, rotationSpeed)
	}
	// 轴动画帧
	rotationAnimationFun(rotationType, rotationSpeed) {
		this.rotationAnimationFrame = requestAnimationFrame(() => this.rotationAnimationFun(rotationType, rotationSpeed))
		this.model.rotation[rotationType] += rotationSpeed / 50
	}



	/**
	 * @describe 辅助线/轴配置模块方法
	 * @function onSetModelHelper 设置模型骨架
	 * @function onSetModelRotateOnAxis 设置模型轴旋转
	 * @function onResultModelRotateOnAxis 重置模型轴位置
	 * @function onSetModelPosition 设置模型位置
	 * @function onResultModelPosition 重置模型位置
	 * @function onResetModelCamera 重置相机位置
	 * @function onGetModelCamera 获取相机位置
	 * @function onSetModelGridHelper 设置网格辅助线位置和颜色
	 * @function onSetModelGridHelperSize 设置网格数量和大小
	 * @function onSetModelAxesHelper 设置坐标轴辅助线
	 */
	// 设置模型骨架
	onSetModelHelper(visible) {
		this.skeletonHelper.visible = visible
	}
	// 设置模型轴旋转
	onSetModelRotateOnAxis(type, flag) {
		const maxAxis = Math.PI / 2
		const { x, y, z } = this.model.rotation
		const endPosition = {
			x, y, z
		}
		endPosition[type] += flag ? maxAxis : -maxAxis
		const Tween = new TWEEN.Tween({ x, y, z })
		Tween.to(endPosition, 500)
		Tween.onUpdate((val) => {
			this.model.rotation[type] = val[type]
		})
		Tween.start();
	}
	// 重置模型轴位置
	onResultModelRotateOnAxis() {
		this.model.rotation.x = 0
		this.model.rotation.y = 0
		this.model.rotation.z = 0
	}
	// 设置模型位置
	onSetModelPosition({ positionX, positionY, positionZ }) {
		const Tween = new TWEEN.Tween(this.model.position)
		const endPosition = {
			x: positionX,
			y: positionY,
			z: positionZ
		}
		Tween.to(endPosition, 500)
		Tween.onUpdate((val) => {
			this.model.position.set(val.x || 0, val.y || 0, val.z || 0)
		})
		Tween.start();
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
	// 获取相机位置
	onGetModelCamera() {
		return this.camera.position
	}
	// 设置网格辅助线位置和颜色
	onSetModelGridHelper({ x, y, z, gridHelper, color }) {
		this.gridHelper.visible = gridHelper
		this.gridHelper.material.color.set(color);

		const Tween = new TWEEN.Tween(this.gridHelper.position)
		const endPosition = {
			x, y, z
		}
		Tween.to(endPosition, 500)
		Tween.onUpdate((val) => {
			this.gridHelper.position.set(val.x || 0, val.y || 0, val.z || 0)
		})
		Tween.start();
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



	/**
	 * @describe 辅助线/轴配置模块方法
	 * @function onDeleteGeometryMesh 删除几何体材质
	 * @function onSetGeometryMesh 修改几何体材质信息
	 */
	onDeleteGeometryMesh(uuid) {
		// 找到需要删除的材质
		const mesh = this.scene.getObjectByProperty('uuid', uuid)
		this.modelMaterialList = this.modelMaterialList.filter(v => v.uuid != uuid)
		this.glowMaterialList = this.modelMaterialList.map(v => v.name)
		mesh.clear()
		this.geometryGroup.remove(mesh)
		this.dragControls.dispose()
        // 更新拖拽函数的材质对象
		if (this.modelMaterialList.length == 0) {
			this.setModelMeshDrag({ modelDrag: false })
		} else {
			this.setModelMeshDrag({ modelDrag: true })
		}
	}
	onSetGeometryMesh(activeGeometry, type) {
		const uuid = store.state.selectMesh.uuid
		const mesh = this.scene.getObjectByProperty('uuid', uuid)
		const geometryData = Object.keys(activeGeometry).map(v => activeGeometry[v])
		// 创建几何体
		const newGeometry = new THREE[type](...geometryData)
		mesh.geometry = newGeometry
	}
}



export default renderModel