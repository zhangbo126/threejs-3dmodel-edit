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
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter'
import { ElMessage } from 'element-plus';
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
		//平行光
		this.hemisphereLight
		// 灯光
		this.ambientLight
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
		// 轴旋转动画对象
		this.rotationAnimate
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
			// 创建平行光
			this.initDirectionalLight()
			// 创建灯光
			this.initAmbientLightt()
			// 创建辅助线
			this.createHelper()
			// 添加物体模型 TODO：初始化时需要默认一个
			const load = await this.setModel({ filePath: 'threeFile/glb/glb-2.glb', type: 'glb' })
			//监听场景大小改变，跳转渲染尺寸
			window.addEventListener("resize", this.onWindowResize.bind(this))
			this.animate()
			reslove(load)
		})
	}
	initScene() {
		this.scene = new THREE.Scene()
		this.scene.background = new THREE.Color('rgba(212, 223, 224)');
	}
	initCamera() {
		const { clientHeight, clientWidth } = this.container
		this.camera = new THREE.PerspectiveCamera(45, clientWidth / clientHeight, 0.25, 100)
	}
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
	// 创建平行光
	initDirectionalLight() {
		this.hemisphereLight = new THREE.HemisphereLight(0xffffff, '#0099cc', 1);
		this.hemisphereLight.position.set(0, 20, 0);
		this.scene.add(this.hemisphereLight)
	}
	// 创建灯光
	initAmbientLightt() {
		this.ambientLight = new THREE.AmbientLight(0xffffff);
		this.scene.add(this.hemisphereLight)
	}
	// 创建平行光辅助线
	createDirectionalLightHelper() {

	}
	render() {
		this.renderer.render(this.scene, this.camera)
	}
	animate() {
		this.renderer.setAnimationLoop(this.render.bind(this))
	}
	initControls() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement)
		this.controls.enableDamping = true
	}
	//加载模型
	setModel({ filePath, type }) {
		return new Promise((resolve, reject) => {
			const loader = this.fileLoaderMap[type]
			loader.load(filePath, (result) => {
				switch (type) {
					case 'glb':
						this.model = result.scene
						this.skeletonHelper = new THREE.SkeletonHelper(result.scene)
						this.modelAnimation = result.animations
						break;
					case 'fbx':
						result.scale.set(.006, .006, .006)
						this.model = result
						break;
					case 'gltf':
						this.model = result.scene
						break;
					case 'obj':
						result.scale.set(.006, .006, .006)
						this.model = result
						break;
					default:
						break;
				}

				// this.model.scale.set(1.2,1.2,2)
				// 设置相机位置
				this.camera.position.set(0, 2, 6)
				// 设置相机坐标系
				this.camera.lookAt(0, 0, 0)
				// 设置模型位置 
				// this.model.position.set(0, 0, 1)
				this.skeletonHelper.visible = false
				this.scene.add(this.skeletonHelper)
				this.scene.add(this.model)
				resolve(true)
			}, () => {

			}, (err) => {
				console.log(err)
				ElMessage.error('模型加载失败', err)
				reject()
			})
		})
	}
	// 创建辅助线
	createHelper() {
		//网格辅助线
		this.gridHelper = new THREE.GridHelper(4, 10, '#1395E6', '#1395E6');
		this.gridHelper.position.set(0, -.2, -.1)
		this.gridHelper.visible = false
		this.scene.add(this.gridHelper)
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
				this.skeletonHelper.visible = false
				this.onClearSceneBg()
				this.scene.remove(this.model)
				// 加载模型
				const load = await this.setModel(model)
				// 模型加载成功返回 true
				reslove(load)
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
		this.scene.background = null
		if (color) {
			this.renderer.setClearColor(color)
		}
	}
	//设置场景图片
	onSetSceneImage(url) {
		this.onClearSceneBg()
		this.scene.background = new THREE.TextureLoader().load(url);
	}
	// 设置全景图
	onSetSceneViewImage(url) {
		this.onClearSceneBg()
		const sphereBufferGeometry = new THREE.SphereBufferGeometry(50, 0, 0);
		sphereBufferGeometry.scale(-2, 1, 1);
		const material = new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load(url)
		});
		this.viewMesh = new THREE.Mesh(sphereBufferGeometry, material);
		// this.scene.background = new THREE.Color( 0xf0f0f0 );
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
	//设置网格辅助线位置 和颜色
	onSetModelGridHelper({ x, y, z, gridHelper ,color}) {
		this.gridHelper.visible = gridHelper
		this.gridHelper.position.set(x, y, z)
		this.gridHelper.material.color.set(color);
	}
	// 设置网格数量和大小
	onSetModelGridHelperSize({ x, y, z, size, divisions ,color,gridHelper}) {
		// 需要先把辅助线移除然后在重新创建
		this.scene.remove(this.gridHelper)
		this.gridHelper.geometry.dispose()
		this.gridHelper.material.dispose()
		this.gridHelper = new THREE.GridHelper(size, divisions, color, color);
		this.gridHelper.position.set(x, y, z)
		this.gridHelper.material.linewidth =0.1
		this.gridHelper.material.color.set(color);
		this.gridHelper.visible= gridHelper
		this.scene.add(this.gridHelper)
    
	}

}
export default renderModel