import * as THREE from 'three' //导入整个 three.js核心库
import { EquirectangularReflectionMapping } from 'three' //导入纹理映射模块
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader' //导入RGB加载器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' //导入控制器模块，轨道控制器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader' //导入GLTF模块，模型解析器,根据文件格式来定


class renderModel {
    constructor(selector) {
        this.container = document.querySelector(selector)
        this.camera
        this.scene
        this.renderer
        this.controls
        this.init()
        this.animate()
    }
    init() {
        //初始化场景
        this.initScene()
        //初始化相机
        this.initCamera()
        //初始化渲染器
        this.initRender()
        //初始化控制器，控制摄像头,控制器一定要在渲染器后
        this.initControls()
        // 添加物体模型
        this.addMesh()
        //监听场景大小改变，跳转渲染尺寸
        window.addEventListener("resize", this.onWindowResize.bind(this))
    }
    initScene() {
        this.scene = new THREE.Scene()
		this.scene.background = new THREE.Color('#999999');
    }
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 200)
        this.camera.position.set(-1.8, 0.6, 20)
    }
    initRender() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true }) //设置抗锯齿
        //设置屏幕像素比
        this.renderer.setPixelRatio(window.devicePixelRatio)
        //渲染的尺寸大小
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        //色调映射
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        //曝光
        this.renderer.toneMappingExposure = 3
        this.container.appendChild(this.renderer.domElement)
    }
    setEnvMap(hdr) { //设置环境背景
        new RGBELoader().setPath('./files/hdr/').load(hdr+'.hdr', (texture) => {
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
    }
    //加载模型
    setModel(modelName) {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader().setPath('threeFile/glb/')
            loader.load("Xbot.glb", (gltf) => {
                this.model = gltf.scene
                this.scene.add(this.model)
                resolve()
            })
        })
    }
    addMesh() {
        this.setModel('phone.glb')
    }
    onWindowResize() { //调整屏幕大小
        this.camera.aspect = window.innerWidth / window.innerHeight //摄像机宽高比例
        this.camera.updateProjectionMatrix() //相机更新矩阵，将3d内容投射到2d面上转换
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
}
export default renderModel