import * as THREE from 'three' //导入整个 three.js核心库
import { EquirectangularReflectionMapping } from 'three' //导入纹理映射模块
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
import { message } from 'ant-design-vue';
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
			// 添加物体模型 TODO：初始化时需要默认一个
			const load = await this.setModel({ filePath: 'threeFile/glb/glb-2.glb', type: 'glb' })
			//监听场景大小改变，跳转渲染尺寸
			window.addEventListener("resize", this.onWindowResize.bind(this))
			this.animate()
			console.log(load)
			reslove(load)
		})
	}
	initScene() {
		this.scene = new THREE.Scene()
		this.scene.background = new THREE.Color('rgba(185, 250, 255)');
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
	setEnvMap(hdr) { //设置环境背景
		new RGBELoader().setPath('./files/hdr/').load(hdr + '.hdr', (texture) => {
			texture.mapping = EquirectangularReflectionMapping  //圆柱形形纹理映射
			this.scene.background = texture
			this.scene.environment = texture
		})
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
				// console.log(gltf)
				// console.log(this.model.position)
				// this.model.scale.set(1.2,1.2,2)
				// 设置相机位置
				this.camera.position.set(0, 0, 6)
				// 设置相机坐标系
				this.camera.lookAt(0, 0, 0)
				// 设置模型位置 
				// this.model.position.set(0, -.5, 0)
				this.scene.add(this.model)
				resolve(true)
			}, () => {

			}, (err) => {
				console.log(err)
				message.error('模型加载失败', err)
				reject()
			})
		})
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
		this.onClearSceneBg()
		this.scene.remove(this.viewMesh)
		if (color) {
			this.renderer.setClearColor(color)
		}
	}
	//设置场景图片
	onSetSceneImage(url) {
		this.onClearSceneBg()
		this.scene.remove(this.viewMesh)
		this.scene.background = new THREE.TextureLoader().load(url);
	}
	// 设置全景图
	onSetSceneViewImage(url) {
		this.onClearSceneBg()
		const geometry = new THREE.SphereBufferGeometry(60, 60, 60);
		geometry.scale(-1, 1, 1);
		const material = new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load(url)
		});
		this.viewMesh = new THREE.Mesh(geometry, material);
		this.scene.background = new THREE.Color( 0xf0f0f0 );
        this.scene.add(this.viewMesh);

	}
	// 清除场景背景
	onClearSceneBg(){
		this.scene.background=null
		if(!this.viewMesh) return false
		this.viewMesh.material.dispose()
		this.viewMesh.geometry.dispose()
		this.scene.remove(this.viewMesh)
	}
}
export default renderModel