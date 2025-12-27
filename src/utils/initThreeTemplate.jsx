// Vue相关
import { defineComponent, h, createApp } from "vue";
import { ElIcon, ElMessage } from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// Three.js核心
import * as THREE from "three";

// Three.js控制器和加载器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

// Three.js后期处理
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

// Three.js渲染器
import { CSS3DObject, CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";

// 项目配置和工具函数
import { vertexShader, fragmentShader } from "@/config/constant.js";
import { mapImageList } from "@/config/model";
import { lightPosition, onlyKey, debounce, getAssetsFile } from "@/utils/utilityFunction";

/**
 * @describe three.js 组件数据初始化方法
 * @param {Object} config 组件参数配置信息
 * @param {String} elementId 容器元素ID
 */
class renderModel {
  constructor(config, elementId) {
    // 基础配置
    this.config = config;
    this.container = document.querySelector("#" + elementId);
    // 场景相关
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.model = null;

    // 加载器配置
    this.fileLoaderMap = {
      glb: new GLTFLoader(),
      fbx: new FBXLoader(this.loadingManager),
      gltf: new GLTFLoader(),
      obj: new OBJLoader(this.loadingManager),
      stl: new STLLoader()
    };

    // 动画相关
    this.modelAnimation = null;
    this.animationMixer = null;
    this.animationClock = new THREE.Clock();
    this.animationFrame = null;
    this.rotationAnimationFrame = null;
    this.animateClipAction = null;
    this.loopMap = {
      LoopOnce: THREE.LoopOnce,
      LoopRepeat: THREE.LoopRepeat,
      LoopPingPong: THREE.LoopPingPong
    };

    // 辅助工具
    this.gridHelper = null;
    this.axesHelper = null;
    this.planeGeometry = null;

    // 材质与贴图
    this.modelMaterialList = null;
    this.modelTextureMap = null;
    this.glowMaterialList = null;
    this.materials = {};

    // 后期处理
    this.effectComposer = null;
    this.outlinePass = null;
    this.renderAnimation = null;
    this.glowComposer = null;
    this.unrealBloomPass = null;
    this.shaderPass = null;

    // 交互相关
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.onWindowResizesListener = null;
    this.onMouseMoveListener = null;

    // CSS3D渲染
    this.css3dControls = null;
    this.css3DRenderer = null;
  }

  async init() {
    try {
      // 初始化基础场景
      this.initRender();
      this.initCamera();
      this.initScene();
      this.initControls();

      // 加载模型
      const load = await this.loadModel(this.config.fileInfo);

      // 设置场景效果
      await Promise.all([
        this.createEffectComposer(),
        this.setSceneBackground(),
        this.setModelMaterial(),
        this.setModelLaterStage(),
        this.setSceneLight(),
        this.setModelAnimation(),
        this.setModelAxleLine(),
        this.setSceneTagsRender()
      ]);

      // 启动渲染
      this.sceneAnimation();
      this.addEvenListMouseListener();

      return load;
    } catch (error) {
      console.error("初始化3D场景失败:", error);
      throw error;
    }
  }
  // 创建渲染器
  initRender() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    }); //设置抗锯齿
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

    // 创建一个CSS3DRenderer
    this.css3DRenderer = new CSS3DRenderer();
    this.css3DRenderer.setSize(clientWidth, clientHeight);
    this.css3DRenderer.domElement.style.position = "absolute";
    this.css3DRenderer.domElement.style.pointerEvents = "none";
    this.css3DRenderer.domElement.style.top = 0;
  }
  // 创建相机
  initCamera() {
    const { clientHeight, clientWidth } = this.container;
    this.camera = new THREE.PerspectiveCamera(45, clientWidth / clientHeight, 0.25, 2000);
    // this.camera.near = 0.1

    const { camera } = this.config;
    if (!camera) return false;
    const { x, y, z } = camera;
    this.camera.position.set(x, y, z);
    this.camera.updateProjectionMatrix();
  }
  // 创建场景
  initScene() {
    this.scene = new THREE.Scene();
  }
  addEvenListMouseListener() {
    // 监听场景大小改变，跳转渲染尺寸
    this.onWindowResizesListener = this.onWindowResize;
    window.addEventListener("resize", this.onWindowResizesListener);
  }
  // 创建控制器
  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = true;
    this.controls.enableDamping = true;
    this.controls.target.set(0, 0, 0);

    //标签控制器
    this.css3dControls = new OrbitControls(this.camera, this.css3DRenderer.domElement);
    this.css3dControls.enablePan = false;
    this.css3dControls.enabled = false;
    this.css3dControls.enableDamping = false;
    this.css3dControls.target.set(0, 0, 0);
    this.css3dControls.update();
  }
  // 更新场景
  sceneAnimation() {
    this.renderAnimation = requestAnimationFrame(() => this.sceneAnimation());
    const { stage, tags } = this.config;
    //辉光效果开关开启时执行
    if (stage && stage.glow) {
      // 将不需要处理辉光的材质进行存储备份
      this.setMeshFlow();
    } else {
      this.effectComposer.render();
      this.controls.update();
    }

    // 3d标签渲染器
    if (tags && tags.dragTagList.length) {
      this.css3DRenderer.render(this.scene, this.camera);
      this.css3dControls.update();
    }
  }
  // 设置材质辉光
  setMeshFlow() {
    this.scene.traverse(v => {
      if (v instanceof THREE.GridHelper) {
        this.materials.gridHelper = v.material;
        v.material = new THREE.MeshStandardMaterial({ color: "#000" });
      }
      if (v instanceof THREE.Scene) {
        this.materials.scene = v.background;
        this.materials.environment = v.environment;
        v.background = null;
        v.environment = null;
      }
      if (!this.glowMaterialList.includes(v.name) && v.isMesh) {
        this.materials[v.uuid] = v.material;
        v.material = new THREE.MeshStandardMaterial({ color: "#000" });
      }
    });
    this.glowComposer.render();
    // 辉光渲染器执行完之后在恢复材质原效果
    this.scene.traverse(v => {
      if (this.materials[v.uuid]) {
        v.material = this.materials[v.uuid];
        delete this.materials[v.uuid];
      }
      if (v instanceof THREE.GridHelper) {
        v.material = this.materials.gridHelper;
        delete this.materials.gridHelper;
      }
      if (v instanceof THREE.Scene) {
        v.background = this.materials.scene;
        v.environment = this.materials.environment;
        delete this.materials.scene;
        delete this.materials.environment;
      }
    });
    this.effectComposer.render();
    this.controls.update();
  }
  // 创建效果合成器
  createEffectComposer() {
    const { clientHeight, clientWidth } = this.container;
    const pixelRatio = this.renderer.getPixelRatio();
    const renderSize = new THREE.Vector2(clientWidth, clientHeight);

    // 主效果合成器
    this.effectComposer = new EffectComposer(
      this.renderer,
      new THREE.WebGLRenderTarget(clientWidth, clientHeight, {
        samples: 4 // 增加采样次数来提高抗锯齿效果
      })
    );

    // 基础渲染通道
    const renderPass = new RenderPass(this.scene, this.camera);
    this.effectComposer.addPass(renderPass);

    // 轮廓通道
    this.outlinePass = new OutlinePass(renderSize, this.scene, this.camera);
    this.configureOutlinePass();
    this.effectComposer.addPass(this.outlinePass);

    // 输出通道
    this.effectComposer.addPass(new OutputPass());

    // FXAA抗锯齿通道
    const effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms.resolution.value.set(1 / (clientWidth * pixelRatio), 1 / (clientHeight * pixelRatio));
    effectFXAA.renderToScreen = true;
    effectFXAA.needsSwap = true;
    effectFXAA.material.uniforms.tDiffuse.value = 1.0;
    effectFXAA.enabled = true;
    this.effectComposer.addPass(effectFXAA);

    // 辉光通道
    this.setupBloomEffect(clientWidth, clientHeight);

    // 自定义着色器通道
    this.setupShaderPass();
  }

  configureOutlinePass() {
    this.outlinePass.visibleEdgeColor = new THREE.Color("#FF8C00");
    this.outlinePass.hiddenEdgeColor = new THREE.Color("#8a90f3");
    this.outlinePass.edgeGlow = 2.0;
    this.outlinePass.edgeThickness = 1;
    this.outlinePass.edgeStrength = 4;
    this.outlinePass.pulsePeriod = 100;
  }

  setupBloomEffect(width, height) {
    // 创建辉光通道
    this.unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0, 0, 0);

    // 辉光合成器
    const renderTarget = new THREE.WebGLRenderTarget(width * 2, height * 2, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false
    });

    this.glowComposer = new EffectComposer(this.renderer, renderTarget);
    this.glowComposer.renderToScreen = false;
    this.glowComposer.addPass(new RenderPass(this.scene, this.camera));
    this.glowComposer.addPass(this.unrealBloomPass);
  }

  setupShaderPass() {
    this.shaderPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: this.glowComposer.renderTarget2.texture },
          tDiffuse: { value: null },
          glowColor: { value: new THREE.Color() }
        },
        vertexShader,
        fragmentShader,
        defines: {}
      }),
      "baseTexture"
    );

    this.shaderPass.renderToScreen = true;
    this.shaderPass.needsSwap = true;
    this.effectComposer.addPass(this.shaderPass);
  }
  // 加载模型
  loadModel({ filePath, fileType, map }) {
    return new Promise((resolve, reject) => {
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
          this.getModelMaterialList(map);
          this.modelAnimation = result.animations || [];
          this.setModelPositionSize();
          this.glowMaterialList = this.modelMaterialList.map(v => v.name);
          this.scene.add(this.model);
          resolve(true);
        },
        () => {},
        err => {
          ElMessage.error("文件错误");
          console.log(err);
          reject();
        }
      );
    });
  }
  onWindowResize = () => {
    // 获取容器尺寸
    const { clientHeight, clientWidth } = this.container;
    const pixelRatio = this.renderer.getPixelRatio();

    // 更新相机参数
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();

    // 更新渲染器尺寸
    this.renderer.setSize(clientWidth, clientHeight);
    this.css3DRenderer.setSize(clientWidth, clientHeight);

    // 更新后期处理效果
    if (this.effectComposer) {
      const fxaaPass = this.effectComposer.passes[3];
      if (fxaaPass && fxaaPass.uniforms) {
        fxaaPass.uniforms.resolution.value.set(1 / (clientWidth * pixelRatio), 1 / (clientHeight * pixelRatio));
      }
      this.effectComposer.setSize(clientWidth, clientHeight);
    }

    // 更新辉光效果
    if (this.glowComposer) {
      this.glowComposer.setSize(clientWidth, clientHeight);
    }
  };
  // 清除模型数据
  onClearModelData() {
    // 取消所有动画帧
    [this.rotationAnimationFrame, this.renderAnimation, this.animationFrame].forEach(frame => {
      if (frame) cancelAnimationFrame(frame);
    });

    // 清除场景中的网格和材质
    this.scene.traverse(v => {
      if (v.type === "Mesh") {
        v.geometry?.dispose();
        v.material?.dispose();
      }
    });

    // 清除辅助对象
    [this.gridHelper, this.axesHelper].forEach(helper => {
      if (helper) {
        helper.clear();
        helper.dispose();
      }
    });

    // 清除渲染器和合成器
    [this.effectComposer, this.glowComposer].forEach(composer => {
      composer?.dispose();
    });

    // 移除事件监听
    this.container?.removeEventListener("mousemove", this.onMouseMoveListener);
    window.removeEventListener("resize", this.onWindowResizesListener);

    // 清除场景和渲染器
    this.scene?.clear();
    this.renderer?.clear();
    this.renderer?.dispose();
    this.camera?.clear();

    // 重置所有属性为null
    const properties = [
      "config",
      "container",
      "camera",
      "scene",
      "renderer",
      "controls",
      "model",
      "fileLoaderMap",
      "modelAnimation",
      "animationMixer",
      "animationClock",
      "animationFrame",
      "rotationAnimationFrame",
      "animateClipAction",
      "loopMap",
      "gridHelper",
      "axesHelper",
      "planeGeometry",
      "modelMaterialList",
      "effectComposer",
      "outlinePass",
      "renderAnimation",
      "raycaster",
      "mouse",
      "modelTextureMap",
      "glowComposer",
      "unrealBloomPass",
      "shaderPass",
      "glowMaterialList",
      "materials",
      "css3dControls",
      "css3DRenderer"
    ];

    properties.forEach(prop => {
      this[prop] = null;
    });
  }

  // 设置模型定位缩放大小
  setModelPositionSize() {
    //设置模型位置
    this.model.updateMatrixWorld();
    const box = new THREE.Box3().setFromObject(this.model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    // 计算缩放比例
    const maxSize = Math.max(size.x, size.y, size.z);
    const targetSize = 2.5; // 目标大小
    const scale = targetSize / (maxSize > 1 ? maxSize : 0.5);
    this.model.scale.set(scale, scale, scale);
    // 设置模型位置
    this.model.position.sub(center.multiplyScalar(scale));
    // 设置控制器最小缩放值
    this.controls.maxDistance = size.length() * 10;
    // 设置相机位置
    // this.camera.position.set(0, 2, 6)
    // 设置相机坐标系
    this.camera.updateProjectionMatrix();
  }
  // 获取当前模型材质
  getModelMaterialList() {
    this.modelMaterialList = [];
    this.model.traverse(v => {
      if (v.isMesh) {
        v.castShadow = true;
        v.frustumCulled = false;
        if (v.material) {
          const newMaterial = v.material.clone();
          v.material = newMaterial;
          this.modelMaterialList.push(v);
        }
      }
    });
  }

  // 处理背景数据回填
  setSceneBackground() {
    const { background } = this.config;
    if (!background) return false;
    // 设置背景
    if (background.visible) {
      const { color, image, viewImg, intensity, blurriness, type = 3 } = background;
      switch (type) {
        case 1:
          this.scene.background = new THREE.Color(color);
          break;
        case 2:
          const bgTexture = new THREE.TextureLoader().load(image);
          this.scene.background = bgTexture;
          bgTexture.dispose();
          break;
        case 3:
          const texture = new THREE.TextureLoader().load(viewImg);
          texture.mapping = THREE.EquirectangularReflectionMapping;
          this.scene.background = texture;
          this.scene.environment = texture;
          this.scene.backgroundIntensity = intensity;
          this.scene.backgroundBlurriness = blurriness;
          texture.dispose();
          break;
        default:
          break;
      }
    } else {
      this.scene.background = new THREE.Color("#000");
    }
  }
  // 处理模型材质数据回填
  setModelMaterial() {
    const { material } = this.config;
    if (!material || !material.meshList) return false;
    const mapIdList = mapImageList.map(v => v.id);
    material.meshList.forEach(v => {
      const mesh = this.model.getObjectByProperty("name", v.meshName);
      if (!mesh) return false;
      const { color, opacity, depthWrite, wireframe, visible, type } = v;
      const { map } = mesh?.material || {};
      if (material.materialType && map) {
        mesh.material = new THREE[type]({
          map
        });
      } else if (mesh.material) {
        mesh.material.map = map;
      }
      // 处理修改了贴图的材质
      if (v.meshFrom) {
        // 如果使用的是系统贴图
        if (mapIdList.includes(v.meshFrom)) {
          // 找到当前的系统材质
          const mapInfo = mapImageList.find(m => m.id == v.meshFrom) || {};
          // 加载系统材质贴图
          const mapTexture = new THREE.TextureLoader().load(mapInfo.url);
          mapTexture.wrapS = THREE.MirroredRepeatWrapping;
          mapTexture.wrapT = THREE.MirroredRepeatWrapping;
          mapTexture.flipY = false;
          mapTexture.colorSpace = THREE.SRGBColorSpace;
          mapTexture.minFilter = THREE.LinearFilter;
          mapTexture.magFilter = THREE.LinearFilter;
          // 如果当前模型的材质类型被修改了，则使用用新的材质type
          if (material.materialType) {
            mesh.material = new THREE[type]({
              map: mapTexture
            });
          } else {
            mesh.material.map = mapTexture;
          }
          mapTexture.dispose();
        } else {
          // 如果是当前模型材质自身贴图
          const meshFrom = this.model.getObjectByProperty("name", v.meshFrom);
          const { map } = meshFrom.material;
          // 如果当前模型的材质类型被修改了，则使用用新的材质type
          if (material.materialType) {
            mesh.material = new THREE[type]({
              map
            });
          } else {
            mesh.material.map = map;
          }
        }
      }
      // 设置材质显隐
      mesh.material.visible = visible;
      //设置材质颜色
      mesh.material.color.set(new THREE.Color(color));
      //设置网格
      mesh.material.wireframe = wireframe;
      // 设置深度写入
      mesh.material.depthWrite = depthWrite;
      //设置透明度
      mesh.material.transparent = true;
      mesh.material.opacity = opacity;
    });
  }
  // 设置辉光和模型操作数据回填
  setModelLaterStage() {
    const { stage } = this.config;
    if (!stage) return false;
    const { threshold, strength, radius, toneMappingExposure, meshPositionList, color } = stage;
    // 设置辉光效果
    if (stage.glow) {
      this.unrealBloomPass.threshold = threshold;
      this.unrealBloomPass.strength = strength;
      this.unrealBloomPass.radius = radius;
      this.renderer.toneMappingExposure = toneMappingExposure;
      this.shaderPass.material.uniforms.glowColor.value = new THREE.Color(color);
    } else {
      this.unrealBloomPass.threshold = 0;
      this.unrealBloomPass.strength = 0;
      this.unrealBloomPass.radius = 0;
      this.renderer.toneMappingExposure = toneMappingExposure;
      this.shaderPass.material.uniforms.glowColor.value = new THREE.Color();
    }
    // 模型材质位置
    meshPositionList.forEach(v => {
      const mesh = this.model.getObjectByProperty("name", v.name);
      if (!mesh) return;
      const { rotation, scale, position } = v;
      mesh.rotation.set(rotation.x, rotation.y, rotation.z);
      mesh.scale.set(scale.x, scale.y, scale.z);
      mesh.position.set(position.x, position.y, position.z);
    });
  }
  // 处理灯光数据回填
  setSceneLight() {
    const { light } = this.config;
    if (!light) return false;
    // 环境光
    if (light.ambientLight) {
      // 创建环境光
      const ambientLight = new THREE.AmbientLight(light.ambientLightColor, light.ambientLightIntensity);
      ambientLight.visible = light.ambientLight;
      this.scene.add(ambientLight);
    }
    // 平行光
    if (light.directionalLight) {
      const directionalLight = new THREE.DirectionalLight(light.directionalLightColor, light.directionalLightIntensity);
      const { x, y, z } = lightPosition(light.directionalHorizontal, light.directionalVertical, light.directionalSistine);
      directionalLight.position.set(x, y, z);
      directionalLight.castShadow = light.directionShadow;
      directionalLight.visible = light.directionalLight;
      this.scene.add(directionalLight);
      const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.5);
      directionalLightHelper.visible = light.directionalLightHelper;
      this.scene.add(directionalLightHelper);
    }
    // 点光源
    if (light.pointLight) {
      const pointLight = new THREE.PointLight(light.pointLightColor, light.pointLightIntensity, 100);
      pointLight.visible = light.pointLight;
      const { x, y, z } = lightPosition(light.pointHorizontal, light.pointVertical, light.pointDistance);
      pointLight.position.set(x, y, z);
      this.scene.add(pointLight);
      // 创建点光源辅助线
      const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
      pointLightHelper.visible = light.pointLightHelper;
      this.scene.add(pointLightHelper);
    }
    // 聚光灯
    if (light.spotLight) {
      const spotLight = new THREE.SpotLight(light.spotLightColor, 900);
      spotLight.visible = light.spotLight;
      const texture = new THREE.TextureLoader().load(getAssetsFile("image/model-bg-1.jpg"));
      texture.dispose();
      spotLight.map = texture;
      spotLight.decay = 2;
      spotLight.shadow.mapSize.width = 1920;
      spotLight.shadow.mapSize.height = 1080;
      spotLight.shadow.camera.near = 1;
      spotLight.shadow.camera.far = 10;
      spotLight.intensity = light.spotLightIntensity;
      spotLight.angle = light.spotAngle;
      spotLight.penumbra = light.spotPenumbra;
      spotLight.shadow.focus = light.spotFocus;
      spotLight.castShadow = light.spotCastShadow;
      spotLight.distance = light.spotDistance;
      const { x, y, z } = lightPosition(light.spotHorizontal, light.spotVertical, light.spotSistine);
      spotLight.position.set(x, y, z);
      this.scene.add(spotLight);
      //创建聚光灯辅助线
      const spotLightHelper = new THREE.SpotLightHelper(spotLight);
      spotLightHelper.visible = light.spotLightHelper && light.spotLight;
      this.scene.add(spotLightHelper);
    }
    // 模型平面
    if (light.planeGeometry) {
      const geometry = new THREE.PlaneGeometry(light.planeWidth, light.planeHeight);
      let groundMaterial = new THREE.MeshStandardMaterial({
        color: light.planeColor
      });
      const planeGeometry = new THREE.Mesh(geometry, groundMaterial);
      planeGeometry.rotation.x = -Math.PI / 2;
      planeGeometry.position.set(0, -1.2, 0);
      planeGeometry.visible = light.planeGeometry;
      planeGeometry.material.side = THREE.DoubleSide;
      planeGeometry.geometry.verticesNeedUpdate = true;
      // 让地面接收阴影
      planeGeometry.receiveShadow = true;
      this.scene.add(planeGeometry);
    }
  }
  // 处理模型动画数据回填
  setModelAnimation() {
    const { animation } = this.config;
    if (!animation) return false;
    if (this.modelAnimation.length && animation && animation.visible) {
      this.animationMixer = new THREE.AnimationMixer(this.model);
      const { animationName, timeScale, weight, loop } = animation;
      // 模型动画
      const clip = THREE.AnimationClip.findByName(this.modelAnimation, animationName);
      if (clip) {
        this.animateClipAction = this.animationMixer.clipAction(clip);
        this.animateClipAction.setEffectiveTimeScale(timeScale);
        this.animateClipAction.setEffectiveWeight(weight);
        this.animateClipAction.setLoop(this.loopMap[loop]);
        this.animateClipAction.play();
      }
      this.animationFrameFun();
    }
    // 轴动画
    if (animation.rotationVisible) {
      const { rotationType, rotationSpeed } = animation;
      this.rotationAnimationFun(rotationType, rotationSpeed);
    }
  }
  // 模型动画帧
  animationFrameFun() {
    this.animationFrame = requestAnimationFrame(() => this.animationFrameFun());
    if (this.animationMixer) {
      this.animationMixer.update(this.animationClock.getDelta());
    }
  }
  // 轴动画帧
  rotationAnimationFun(rotationType, rotationSpeed) {
    this.rotationAnimationFrame = requestAnimationFrame(() => this.rotationAnimationFun(rotationType, rotationSpeed));
    this.model.rotation[rotationType] += rotationSpeed / 50;
  }
  // 模型轴辅助线配置
  setModelAxleLine() {
    const { attribute } = this.config;

    if (!attribute) return false;
    const {
      axesHelper,
      axesSize,
      color,
      divisions,
      gridHelper,
      positionX,
      positionY,
      positionZ,
      size,
      visible,
      x,
      y,
      z,
      rotationX,
      rotationY,
      rotationZ
    } = attribute;
    if (!visible) return false;
    //网格辅助线
    this.gridHelper = new THREE.GridHelper(size, divisions, color, color);
    this.gridHelper.position.set(x, y, z);
    this.gridHelper.visible = gridHelper;
    this.gridHelper.material.linewidth = 0.1;
    this.scene.add(this.gridHelper);
    // 坐标轴辅助线
    this.axesHelper = new THREE.AxesHelper(axesSize);
    this.axesHelper.visible = axesHelper;
    this.axesHelper.position.set(0, -0.5, 0);
    this.scene.add(this.axesHelper);
    // 设置模型位置
    this.model.position.set(positionX, positionY, positionZ);
    // 设置模型轴位置
    this.model.rotation.set(rotationX, rotationY, rotationZ);
    // 开启阴影
    this.renderer.shadowMap.enabled = true;
  }
  // 处理标签渲染
  setSceneTagsRender() {
    const { tags } = this.config;
    if (!tags?.dragTagList?.length) return;

    this.container.appendChild(this.css3DRenderer.domElement);

    const createTagElement = tagConfig => {
      const {
        backgroundColor,
        color,
        fontSize,
        height,
        iconColor,
        iconName,
        iconSize,
        innerText,
        positionX,
        positionY,
        positionZ,
        width
      } = tagConfig;

      const element = document.createElement("div");

      // 创建标签组件
      const TagComponent = createApp({
        render() {
          return (
            <div>
              <div
               className="text-center element-tag"
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  fontSize: `${fontSize}px`,
                  color,
                  backgroundColor,
                  boxShadow: `0px 0px 4px ${backgroundColor}`
                }}
              >
                <span className="tag-txt">{innerText}</span>
              </div>
              <div
                className="text-center text-[#fff] text-[12px] tag-icon"
                style={{
                  fontSize: `${iconSize}px`,
                  color: iconColor
                }}
              >
                <ElIcon>{h(ElementPlusIconsVue[iconName])}</ElIcon>
              </div>
            </div>
          );
        }
      });

      // 挂载组件
      const vNode = TagComponent.mount(document.createElement("div"));
      element.appendChild(vNode.$el);

      // 创建3D对象
      const cssObject = new CSS3DObject(element);
      cssObject.position.set(positionX, positionY, positionZ);
      cssObject.scale.set(0.01, 0.01, 0.01);

      return cssObject;
    };

    // 批量创建标签并添加到场景
    tags.dragTagList.forEach(tagConfig => {
      const tagObject = createTagElement(tagConfig);
      this.scene.add(tagObject);
    });
  }
}

/**
 * 动态创建3D模型组件
 * @param {Object} config - 组件配置参数
 * @returns {Object} Vue组件
 */
function createThreeDComponent(config) {
  const elementId = `three-model-${onlyKey(5, 10)}`;
  let modelApi = null;

  return defineComponent({
    name: "ThreeDComponent",
    props: {
      width: [String, Number],
      height: [String, Number]
    },
    data: () => ({
      loading: false
    }),
    watch: {
      $props: {
        handler: () => {
          modelApi?.onWindowResize && debounce(modelApi.onWindowResize, 200)();
        },
        deep: true
      }
    },

    async mounted() {
      try {
        this.loading = true;
        modelApi = new renderModel(config, elementId);
        await modelApi.init();
      } catch (err) {
        console.error("3D模型加载失败:", err);
      } finally {
        this.loading = false;
      }
    },

    beforeUnmount() {
      modelApi?.onClearModelData();
      modelApi = null;
    },
    render() {
      const style = {
        width: this.width ? `${this.width - 10}px` : "100%",
        height: this.height ? `${this.height - 10}px` : "100%",
        pointerEvents: this.width && this.height ? "none" : undefined
      };
      return <div id={elementId} style={style} v-zLoading={this.loading}></div>;
    }
  });
}

export default createThreeDComponent;
