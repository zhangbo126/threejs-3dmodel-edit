/**
 * @file 材质管理模块
 * @description 提供场景中各种材质的控制方法，包括材质属性设置、贴图管理、材质切换等功能
 */

import * as THREE from "three";
import { toRaw } from "vue";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { findObjectInScene } from "@/utils/utilityFunction.js";
import { useMeshEditStore } from "@/store/meshEditStore";

const store = useMeshEditStore();

export default class MaterialModules {
  /**
   * 获取当前模型材质列表
   * @throws {Error} 获取材质列表失败时抛出错误
   */
  getModelMaterialList() {
    try {
      store.modelApi.modelMaterialList = [];
      store.modelApi.model.traverse((v, i) => {
        if (!v.isMesh || !v.material) return;

        v.castShadow = true;
        v.frustumCulled = false;

        if (Array.isArray(v.material)) {
          v.material = v.material[0];
        }
        this.setMaterialMeshParams(v, i);
      });
    } catch (error) {
      console.error("获取模型材质列表失败:", error);
      throw error;
    }
  }

  /**
   * 处理材质参数
   * @param {Object} mesh - 网格对象
   * @param {Number} index - 索引
   * @throws {Error} 处理材质参数失败时抛出错误
   */
  setMaterialMeshParams(mesh, index) {
    try {
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

      store.modelApi.modelMaterialList.push(meshData);

      const cloneMaterial = mesh.material.clone();
      cloneMaterial.userData.mapId = `${mesh.name}_${index}`;
      store.modelApi.originalMaterials.set(mesh.uuid, cloneMaterial);
    } catch (error) {
      console.error("处理材质参数失败:", error);
      throw error;
    }
  }
  /**
   * 设置模型位置和大小
   * @throws {Error} 设置模型位置和大小失败时抛出错误
   */
  setModelPositionSize() {
    try {
      store.modelApi.model.updateMatrixWorld();
      const box = new THREE.Box3().setFromObject(store.modelApi.model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      const maxSize = Math.max(size.x, size.y, size.z);
      const scale = 2.5 / (maxSize > 1 ? maxSize : 0.5);

      store.modelApi.model.scale.setScalar(scale);
      store.modelApi.model.position.sub(center.multiplyScalar(scale));

      store.modelApi.controls.maxDistance = size.length() * 10;
      store.modelApi.camera.position.set(0, 2, 6);
      store.modelApi.camera.updateProjectionMatrix();
    } catch (error) {
      console.error("设置模型位置和大小失败:", error);
      throw error;
    }
  }

  /**
   * 获取模型自带贴图
   * @param {Array} materials - 材质数组
   * @returns {Object} 贴图数据
   * @throws {Error} 获取模型贴图失败时抛出错误
   */
  getModelMaps(materials) {
    try {
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
    } catch (error) {
      console.error("获取模型贴图失败:", error);
      throw error;
    }
  }

  /**
   * 设置材质属性
   * @param {Object} config - 材质配置
   * @throws {Error} 设置材质属性失败时抛出错误
   */
  onSetModelMaterial(config) {
    try {
      const { color, wireframe, depthWrite, opacity } = JSON.parse(JSON.stringify(config));
      const uuid = store.selectMesh.uuid;
      const mesh = store.modelApi.scene.getObjectByProperty("uuid", uuid);

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

        const listMesh = store.modelApi.modelMaterialList.find(v => v.uuid === uuid);
        if (listMesh) {
          Object.assign(listMesh.material, {
            color: new THREE.Color(color),
            wireframe,
            depthWrite,
            opacity
          });
        }
      }
    } catch (error) {
      console.error("设置材质属性失败:", error);
      throw error;
    }
  }

  /**
   * 设置材质显隐
   * @param {Object} config - 配置参数
   * @param {string} config.uuid - 网格UUID
   * @param {boolean} config.visible - 是否可见
   * @throws {Error} 设置材质显隐失败时抛出错误
   */
  onSetMeshVisible({ uuid, visible }) {
    try {
      const mesh = store.modelApi.scene.getObjectByProperty("uuid", uuid);
      if (mesh) mesh.visible = visible;
    } catch (error) {
      console.error("设置材质显隐失败:", error);
      throw error;
    }
  }

  /**
   * 设置模型自带贴图
   * @param {Object} params - 贴图参数
   * @param {string} params.mapId - 贴图ID
   * @param {string} params.meshName - 网格名称
   * @throws {Error} 设置模型贴图失败时抛出错误
   */
  onSetModelMap({ mapId, meshName }) {
    try {
      const uuid = store.selectMesh.uuid;
      const mesh = store.modelApi.scene.getObjectByProperty("uuid", uuid);
      if (!mesh) return;

      const originMaterial = store.modelApi.originalMaterials.get(uuid);
      mesh.material = originMaterial.clone();
      mesh.mapId = mapId;
      mesh.meshFrom = meshName;
    } catch (error) {
      console.error("设置模型贴图失败:", error);
      throw error;
    }
  }

  /**
   * 设置系统贴图
   * @param {Object} params - 贴图参数
   * @param {string} params.id - 贴图ID
   * @param {string} params.url - 贴图URL
   * @returns {Promise} 设置结果
   * @throws {Error} 设置系统贴图失败时抛出错误
   */
  onSetSystemModelMap({ id, url }) {
    return new Promise((resolve, reject) => {
      try {
        const uuid = store.selectMesh.uuid;
        const mesh = store.modelApi.scene.getObjectByProperty("uuid", uuid);
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
      } catch (error) {
        console.error("设置系统贴图失败:", error);
        reject(error);
      }
    });
  }

  /**
   * 设置外部贴图
   * @param {String} url - 贴图URL
   * @param {String} type - 贴图类型
   * @returns {Promise} 设置结果
   * @throws {Error} 设置外部贴图失败时抛出错误
   */
  onSetStorageModelMap(url, type) {
    return new Promise(async (resolve, reject) => {
      try {
        const uuid = store.selectMesh.uuid;
        const mesh = store.modelApi.scene.getObjectByProperty("uuid", uuid);
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
      } catch (error) {
        console.error("设置外部贴图失败:", error);
        reject(error);
      }
    });
  }

  /**
   * 选择材质
   * @param {String} name - 材质名称
   * @returns {Object|null} 选中的网格对象
   * @throws {Error} 选择材质失败时抛出错误
   */
  onChangeModelMaterial(name) {
    try {
      const mesh = store.modelApi.model.getObjectByName(name);
      if (!mesh) return null;

      store.modelApi.outlinePass.selectedObjects = [toRaw(mesh)];
      store.selectMeshAction(mesh);
      return mesh;
    } catch (error) {
      console.error("选择材质失败:", error);
      throw error;
    }
  }

  /**
   * 模型点击事件处理
   * @param {Event} event - 点击事件
   * @returns {boolean} 是否处理了点击事件
   * @throws {Error} 处理点击事件失败时抛出错误
   */
  onMouseClickModel(event) {
    try {
      const { clientHeight, clientWidth, offsetLeft, offsetTop } = store.modelApi.container;
      const { mouse, geometryGroup, raycaster, camera, outlinePass, transformControls } = store.modelApi;
      mouse.x = ((event.clientX - offsetLeft) / clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - offsetTop) / clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      let model = store.modelApi.model;
      if (geometryGroup.children.length) {
        model = geometryGroup;
      }
      if (!model) return false;

      const intersects = raycaster
        .intersectObjects(toRaw(model.children), true)
        .filter(item => item.object.isMesh && item.object.material);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;

        Object.assign(outlinePass, {
          visibleEdgeColor: new THREE.Color("#FF8C00"),
          hiddenEdgeColor: new THREE.Color("#8a90f3"),
          selectedObjects: [intersectedObject]
        });

        store.selectMeshAction(intersectedObject);

        if (transformControls) {
          const boundingBox = new THREE.Box3().setFromObject(intersectedObject);
          const { dragPosition } = intersectedObject.userData;

          const position = dragPosition || boundingBox.getCenter(new THREE.Vector3());
          if (!dragPosition) {
            intersectedObject.userData.dragPosition = position;
          }
          const transformControlsPlane = findObjectInScene(store.modelApi.scene, { type: "TransformControlsPlane" });
          transformControlsPlane.position.copy(position);
          transformControls.attach(intersectedObject);
        }
      } else if (!transformControls) {
        outlinePass.selectedObjects = [];
        store.selectMeshAction({});
      }
    } catch (error) {
      console.error("处理点击事件失败:", error);
      throw error;
    }
  }

  /**
   * 获取最新材质信息列表
   * @returns {Array} 材质列表
   * @throws {Error} 获取材质信息列表失败时抛出错误
   */
  onGetEditMeshList() {
    try {
      const meshList = [];
      store.modelApi.model.traverse(v => {
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
    } catch (error) {
      console.error("获取材质信息列表失败:", error);
      throw error;
    }
  }

  /**
   * 切换材质类型
   * @param {Object} activeMesh - 当前材质
   * @throws {Error} 切换材质类型失败时抛出错误
   */
  onChangeModelMeshType(activeMesh) {
    try {
      store.modelApi.model.traverse(v => {
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
          v.material = store.modelApi.originalMaterials.get(v.uuid);
        }

        if (depthWrite) v.material.depthWrite = depthWrite;
        if (opacity) v.material.opacity = opacity;
        if (wireframe) v.material.wireframe = wireframe;

        v.material.side = THREE.DoubleSide;
      });
    } catch (error) {
      console.error("切换材质类型失败:", error);
      throw error;
    }
  }

  /**
   * 设置几何体材质列表
   * @throws {Error} 设置几何体材质列表失败时抛出错误
   */
  onSetGeometryMeshList() {
    try {
      store.modelApi.modelMaterialList = [];
      store.modelApi.model.traverse(v => {
        if (!v.isMesh || !v.material) return;
        v.castShadow = true;
        v.frustumCulled = false;
        store.modelApi.modelMaterialList.push(v);
        store.modelApi.originalMaterials.set(v.uuid, v.material);
        v.mapId = v.name;
      });
    } catch (error) {
      console.error("设置几何体材质列表失败:", error);
      throw error;
    }
  }

  /**
   * 重置模型材质数据
   * @throws {Error} 重置模型材质数据失败时抛出错误
   */
  initModelMaterial() {
    try {
      store.modelApi.model.traverse(v => {
        if (!v.isMesh || !v.material) return;

        const originalMaterial = store.modelApi.originalMaterials.get(v.uuid);
        v.material = originalMaterial.clone();
        v.mapId = originalMaterial.userData.mapId;
        v.visible = true;
        v.meshFrom = null;
      });

      store.modelApi.modelMaterialList.forEach(v => {
        v.visible = true;
        const originalMaterial = store.modelApi.originalMaterials.get(v.uuid);
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
    } catch (error) {
      console.error("重置模型材质数据失败:", error);
      throw error;
    }
  }
}
