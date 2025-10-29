import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
//导入控制器模块，轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { lightPosition } from "@/utils/utilityFunction";
import { ElMessage } from "element-plus";

class vrRenderModel {
  constructor(selector) {
    this.container = document.querySelector(selector);
    // 相机
    this.camera;
    // 场景
    this.scene = null;
    //渲染器
    this.renderer;
    // 控制器
    this.controls;
    // 模型
    this.model;
    // 当前模型加载状态
    this.loadingStatus = true;
    //文件加载器类型
    this.fileLoaderMap = {
      glb: new GLTFLoader(),
      fbx: new FBXLoader(this.loadingManager),
      gltf: new GLTFLoader(),
      obj: new OBJLoader(this.loadingManager),
      stl: new STLLoader()
    };
    // 模型上传进度条回调函数
    this.modelProgressCallback = e => e;
    // 环境光
    this.ambientLight;
    // 平行光
    this.directionalLight;
  }
  init() {
    return new Promise(async (resolve, reject) => {
      //初始化渲染器
      this.initRender();
      //初始化相机
      this.initCamera();
      //初始化场景
      this.initScene();
      this.addEvenListMouseListener();
      // 创建控制器
      this.initControls();
      // 创建灯光
      this.createLight();
      // 添加物体模型 TODO：初始化时需要默认一个
      const load = await this.setModel({
        filePath: "threeFile/glb/glb-25.glb",
        fileType: "glb",
        decomposeName: "transformers_3"
      });
      resolve(true);
      this.sceneAnimation();
    });
  }
  // 创建渲染器
  initRender() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); //设置抗锯齿

    //设置屏幕像素比
    this.renderer.setPixelRatio(window.devicePixelRatio);
    //渲染的尺寸大小
    const { clientHeight, clientWidth } = this.container;
    this.renderer.setSize(clientWidth, clientHeight);
    //色调映射
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.autoClear = true;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    //曝光
    this.renderer.toneMappingExposure = 2;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);
  }
  // 创建相机
  initCamera() {
    const { clientHeight, clientWidth } = this.container;
    this.camera = new THREE.PerspectiveCamera(50, clientWidth / clientHeight, 1, 2000);
  }
  // 创建场景
  async initScene() {
    this.scene = new THREE.Scene();

    const isMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    const facingMode = isMobile() ? "environment" : "user"; //environment
    const video = document.getElementById("video");
    const { clientWidth, clientHeight } = this.container;

    const environment = { video: { width: clientHeight, height: clientWidth, facingMode } };
    const user = {
      video: { width: clientWidth, height: clientHeight, facingMode }
    };
    const constraints = facingMode == "environment" ? environment : user;

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
      video.play();
      const texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.mapping = THREE.UVMapping;
      this.scene.background = texture;
      texture.update();
    } catch (err) {
      // alert(err);
      ElMessage.error("当前设备摄像头无法使用,请检查");
    }
  }
  // 加载模型
  setModel({ filePath, fileType }) {
    return new Promise((resolve, reject) => {
      this.loadingStatus = false;
      let loader;
      if (["glb", "gltf"].includes(fileType)) {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(`draco/`);
        dracoLoader.setDecoderConfig({ type: "js" });
        dracoLoader.preload();
        loader = new GLTFLoader().setDRACOLoader(dracoLoader);
      } else {
        loader = this.fileLoaderMap[fileType];
      }
      loader.load(
        filePath,
        result => {
          switch (fileType) {
            case "glb":
              this.model = result.scene;
              break;
            case "fbx":
              this.model = result;
              break;
            case "gltf":
              this.model = result.scene;
              break;
            case "obj":
              this.model = result;
              break;
            case "stl":
              const material = new THREE.MeshStandardMaterial();
              const mesh = new THREE.Mesh(result, material);
              this.model = mesh;
              break;
            default:
              break;
          }
          this.setModelPositionSize();

          // 需要辉光的材质
          this.scene.add(this.model);
          resolve(true);
        },
        xhr => {
          this.modelProgressCallback(xhr.loaded);
        },
        err => {
          ElMessage.error("文件错误");
          console.log(err);
          resolve(true);
        }
      );
    });
  }

  // 模型加载进度条回调函数
  onProgress(callback) {
    if (typeof callback == "function") {
      this.modelProgressCallback = callback;
    }
  }
  // 设置模型定位缩放大小
  setModelPositionSize() {
    this.model.traverse(v => {
      if (v.isMesh && v.material) {
        v.castShadow = true;
        v.frustumCulled = false;
      }
    });
    //设置模型位置
    this.model.updateMatrixWorld();
    const box = new THREE.Box3().setFromObject(this.model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    // 计算缩放比例
    const maxSize = Math.max(size.x, size.y, size.z);
    const targetSize = 2; // 目标大小
    const scale = targetSize / (maxSize > 1 ? maxSize : 0.5);
    this.model.scale.set(scale, scale, scale);
    // 设置模型位置
    this.model.position.sub(center.multiplyScalar(scale));

    // 设置控制器最小缩放值
    this.controls.maxDistance = size.length() * 10;
    // 设置相机位置
    this.camera.position.set(0, 2, 6);
    // 设置相机坐标系
    this.camera.updateProjectionMatrix();
  }
  // 更新场景
  sceneAnimation() {
    this.renderAnimation = requestAnimationFrame(() => this.sceneAnimation());
    // 等模型加载和相关数据处理完成在执行
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
  // 监听事件
  addEvenListMouseListener() {
    //监听场景大小改变，跳转渲染尺寸
    this.onWindowResizesListener = this.onWindowResizes.bind(this);
    window.addEventListener("resize", this.onWindowResizesListener);
  }
  // 监听窗口变化
  onWindowResizes() {
    if (!this.container) return false;
    const { clientHeight, clientWidth } = this.container;
    //调整屏幕大小
    this.camera.aspect = clientWidth / clientHeight;
    //相机更新矩阵，将3d内容投射到2d面上转换
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight);
  }
  // 创建控制器
  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = true;
    this.controls.enableDamping = true;
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }
  // 创建灯光
  createLight() {
    // 创建环境光
    this.ambientLight = new THREE.AmbientLight("#fff", 3);
    this.scene.add(this.ambientLight);
    // 创建平行光
    this.directionalLight = new THREE.DirectionalLight("#fff", 5);
    const { x, y, z } = lightPosition(-6.48, -4.58, 3);
    this.directionalLight.position.set(x, y, z);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);

    const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
    const planeMaterial = new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.5 });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;

    plane.position.set(0, -1.2, 0);
    plane.receiveShadow = true;
    plane.material.side = THREE.DoubleSide;
    plane.material.color.set("#23191F");
    plane.geometry.verticesNeedUpdate = true;

    this.scene.add(plane);
  }
}

export default vrRenderModel;
