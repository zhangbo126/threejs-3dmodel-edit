/**
 * @description 材质模块方法集合
 * @module materialModules
 */

import * as THREE from "three";
import { toRaw } from "vue";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { findObjectInScene } from "@/utils/utilityFunction.js";
import { useMeshEditStore } from "@/store/meshEditStore";

const store = useMeshEditStore();

/**
 * 获取当前模型材质列表
 */
function getModelMaterialList() {
  this.modelMaterialList = [];
  this.model.traverse((v, i) => {
    if (!v.isMesh || !v.material) return;

    v.castShadow = true;
    v.frustumCulled = false;

    if (Array.isArray(v.material)) {
      v.material = v.material[0];
    }
    this.setMaterialMeshParams(v, i);
  });
}

/**
 * 处理材质参数
 * @param {Object} mesh - 网格对象
 * @param {Number} index - 索引
 */
function setMaterialMeshParams(mesh, index) {
  const newMesh = mesh.clone();
  mesh.userData = {
    ...mesh.userData,
    rotation: newMesh.rotation,
    scale: newMesh.scale,
    position: newMesh.position
  };

  const newMaterial = mesh.material.clone();
  mesh.mapId = `${mesh.name}_${index}`;
  mesh.material = newMaterial;

  const { mapId, uuid, userData, type, name, isMesh, visible } = mesh;
  const { color, wireframe, depthWrite, opacity } = mesh.material;

  const meshData = {
    mapId,
    uuid,
    userData,
    type,
    name,
    isMesh,
    visible,
    material: { color, wireframe, depthWrite, opacity }
  };

  this.modelMaterialList.push(meshData);

  const cloneMaterial = mesh.material.clone();
  cloneMaterial.userData.mapId = `${mesh.name}_${index}`;
  this.originalMaterials.set(mesh.uuid, cloneMaterial);
}

/**
 * 设置模型位置和大小
 */
function setModelPositionSize() {
  this.model.updateMatrixWorld();
  const box = new THREE.Box3().setFromObject(this.model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxSize = Math.max(size.x, size.y, size.z);
  const scale = 2.5 / (maxSize > 1 ? maxSize : 0.5);

  this.model.scale.setScalar(scale);
  this.model.position.sub(center.multiplyScalar(scale));

  this.controls.maxDistance = size.length() * 10;
  this.camera.position.set(0, 2, 6);
  this.camera.updateProjectionMatrix();
}

/**
 * 获取模型自带贴图
 * @param {Array} materials - 材质数组
 * @returns {Object} 贴图数据
 */
function getModelMaps(materials) {
  for (const texture of materials) {
    if (!texture.map?.image) continue;

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 75;

    const context = canvas.getContext("2d");
    context.drawImage(texture.map.image, 0, 0);

    const textureMap = {
      url: canvas.toDataURL("image/png", 0.5)
    };

    canvas.remove();
    return textureMap;
  }
  return {};
}

/**
 * 设置材质属性
 * @param {Object} config - 材质配置
 */
function onSetModelMaterial(config) {
  const { color, wireframe, depthWrite, opacity } = JSON.parse(JSON.stringify(config));
  const uuid = store.selectMesh.uuid;
  const mesh = this.scene.getObjectByProperty("uuid", uuid);

  if (mesh?.material) {
    const { name, map } = mesh.material;
    Object.assign(mesh.material, {
      map,
      name,
      transparent: true,
      color: new THREE.Color(color),
      wireframe,
      depthWrite,
      opacity
    });

    const listMesh = this.modelMaterialList.find(v => v.uuid === uuid);
    if (listMesh) {
      Object.assign(listMesh.material, {
        color: new THREE.Color(color),
        wireframe,
        depthWrite,
        opacity
      });
    }
  }
}

/**
 * 设置材质显隐
 * @param {Object} config - 配置参数
 */
function onSetMeshVisible({ uuid, visible }) {
  const mesh = this.scene.getObjectByProperty("uuid", uuid);
  if (mesh) mesh.visible = visible;
}

/**
 * 设置模型自带贴图
 * @param {Object} params - 贴图参数
 */
function onSetModelMap({ mapId, meshName }) {
  const uuid = store.selectMesh.uuid;
  const mesh = this.scene.getObjectByProperty("uuid", uuid);
  if (!mesh) return;

  const originMaterial = this.originalMaterials.get(uuid);
  mesh.material = originMaterial.clone();
  mesh.mapId = mapId;
  mesh.meshFrom = meshName;
}

/**
 * 设置系统贴图
 * @param {Object} params - 贴图参数
 */
function onSetSystemModelMap({ id, url }) {
  return new Promise(resolve => {
    const uuid = store.selectMesh.uuid;
    const mesh = this.scene.getObjectByProperty("uuid", uuid);
    if (!mesh) {
      resolve();
      return;
    }

    const texture = new THREE.TextureLoader().load(url);
    const newMaterial = mesh.material.clone();

    Object.assign(texture, {
      wrapS: THREE.MirroredRepeatWrapping,
      wrapT: THREE.MirroredRepeatWrapping,
      flipY: false,
      colorSpace: THREE.SRGBColorSpace,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter
    });

    newMaterial.map = texture;
    mesh.material = newMaterial;
    mesh.mapId = id;
    mesh.meshFrom = id;

    texture.dispose();
    resolve();
  });
}

/**
 * 设置外部贴图
 * @param {String} url - 贴图URL
 * @param {String} type - 贴图类型
 */
function onSetStorageModelMap(url, type) {
  return new Promise(async resolve => {
    const uuid = store.selectMesh.uuid;
    const mesh = this.scene.getObjectByProperty("uuid", uuid);
    if (!mesh) {
      resolve();
      return;
    }

    const loader = type === "hdr" ? new RGBELoader() : new THREE.TextureLoader();
    const texture = await loader.loadAsync(url);
    const newMaterial = mesh.material.clone();

    Object.assign(texture, {
      wrapS: THREE.MirroredRepeatWrapping,
      wrapT: THREE.MirroredRepeatWrapping,
      flipY: false,
      colorSpace: THREE.SRGBColorSpace,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter
    });

    newMaterial.map = texture;
    mesh.material = newMaterial;
    texture.dispose();
    resolve();
  });
}

/**
 * 选择材质
 * @param {String} name - 材质名称
 */
function onChangeModelMaterial(name) {
  const mesh = this.model.getObjectByName(name);
  if (!mesh) return null;

  this.outlinePass.selectedObjects = [toRaw(mesh)];
  console.log(this.outlinePass);
  store.selectMeshAction(mesh);
  return mesh;
}

/**
 * 模型点击事件处理
 * @param {Event} event - 点击事件
 */
function onMouseClickModel(event) {
  const { clientHeight, clientWidth, offsetLeft, offsetTop } = this.container;

  this.mouse.x = ((event.clientX - offsetLeft) / clientWidth) * 2 - 1;
  this.mouse.y = -((event.clientY - offsetTop) / clientHeight) * 2 + 1;

  this.raycaster.setFromCamera(this.mouse, this.camera);

  let model = this.model;
  if (this.geometryGroup.children.length) {
    model = this.geometryGroup;
  }
  if (!model) return false;

  const intersects = this.raycaster
    .intersectObjects(model.children, true)
    .filter(item => item.object.isMesh && item.object.material);

  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;

    Object.assign(this.outlinePass, {
      visibleEdgeColor: new THREE.Color("#FF8C00"),
      hiddenEdgeColor: new THREE.Color("#8a90f3"),
      selectedObjects: [intersectedObject]
    });

    store.selectMeshAction(intersectedObject);

    if (this.transformControls) {
      const boundingBox = new THREE.Box3().setFromObject(intersectedObject);
      const { dragPosition } = intersectedObject.userData;

      const position = dragPosition || boundingBox.getCenter(new THREE.Vector3());
      if (!dragPosition) {
        intersectedObject.userData.dragPosition = position;
      }
      const transformControlsPlane = findObjectInScene(this.scene, { type: "TransformControlsPlane" });
      transformControlsPlane.position.copy(position);
      this.transformControls.attach(intersectedObject);
    }
  } else if (!this.transformControls) {
    this.outlinePass.selectedObjects = [];
    store.selectMeshAction({});
  }
}

/**
 * 获取最新材质信息列表
 * @returns {Array} 材质列表
 */
function onGetEditMeshList() {
  const meshList = [];
  this.model.traverse(v => {
    if (!v.isMesh || !v.material) return;

    const { color, opacity, depthWrite, wireframe, type } = v.material;
    meshList.push({
      meshName: v.name,
      meshFrom: v.meshFrom,
      color: color.getStyle(),
      opacity,
      depthWrite,
      wireframe,
      visible: v.visible,
      type
    });
  });
  return meshList;
}

/**
 * 切换材质类型
 * @param {Object} activeMesh - 当前材质
 */
function onChangeModelMeshType(activeMesh) {
  this.model.traverse(v => {
    if (!v.isMesh || !v.material) return;

    const { name, color, map, wireframe, depthWrite, opacity } = v.material;

    if (activeMesh.type) {
      v.material = new THREE[activeMesh.type]({
        map,
        transparent: true,
        color,
        name
      });
    } else {
      v.material = this.originalMaterials.get(v.uuid);
    }

    if (depthWrite) v.material.depthWrite = depthWrite;
    if (opacity) v.material.opacity = opacity;
    if (wireframe) v.material.wireframe = wireframe;

    v.material.side = THREE.DoubleSide;
  });
}

/**
 * 设置几何体材质列表
 */
function onSetGeometryMeshList() {
  this.modelMaterialList = [];
  this.model.traverse(v => {
    if (!v.isMesh || !v.material) return;
    console.log(v);
    v.castShadow = true;
    v.frustumCulled = false;

    this.modelMaterialList.push(v);
    this.originalMaterials.set(v.uuid, v.material);
    v.mapId = v.name;
  });
}

/**
 * 重置模型材质数据
 */
function initModelMaterial() {
  this.model.traverse(v => {
    if (!v.isMesh || !v.material) return;

    const originalMaterial = this.originalMaterials.get(v.uuid);
    v.material = originalMaterial.clone();
    v.mapId = originalMaterial.userData.mapId;
    v.visible = true;
    v.meshFrom = null;
  });

  this.modelMaterialList.forEach(v => {
    v.visible = true;
    const originalMaterial = this.originalMaterials.get(v.uuid);
    v.mapId = originalMaterial.userData.mapId;

    const { color, wireframe, depthWrite, opacity } = originalMaterial;
    Object.assign(v.material, {
      color,
      wireframe,
      depthWrite,
      opacity
    });
  });

  store.selectMeshAction({});
}

export default {
  getModelMaterialList,
  setModelPositionSize,
  getModelMaps,
  onSetModelMaterial,
  onSetModelMap,
  onSetSystemModelMap,
  onSetStorageModelMap,
  onChangeModelMaterial,
  onMouseClickModel,
  onGetEditMeshList,
  onChangeModelMeshType,
  onSetGeometryMeshList,
  onSetMeshVisible,
  initModelMaterial,
  setMaterialMeshParams
};
