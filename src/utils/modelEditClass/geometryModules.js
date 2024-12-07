/**
 * 几何体模块方法集合
 *
 * @module GeometryModules
 * @description 包含场景中几何体的创建、修改和删除等操作方法
 *
 * @exports {Object} default - 导出的方法集合
 * @property {Function} onDeleteGeometryMesh - 删除指定几何体
 * @property {Function} onSetGeometryMesh - 更新几何体属性
 */

import * as THREE from "three";
import { useMeshEditStore } from "@/store/meshEditStore";
const store = useMeshEditStore();

/**
 * 删除指定几何体
 * @param {string} uuid - 要删除的几何体UUID
 */
function onDeleteGeometryMesh(uuid) {
  // 获取目标几何体
  const mesh = this.scene.getObjectByProperty("uuid", uuid);

  // 更新材质列表
  this.modelMaterialList = this.modelMaterialList.filter(item => item.uuid !== uuid);
  this.glowMaterialList = this.modelMaterialList.map(item => item.name);

  // 清除并移除几何体
  mesh.clear();
  this.geometryGroup.remove(mesh);
}

/**
 * 更新几何体属性
 * @param {Object} activeGeometry - 几何体参数配置
 * @param {string} type - 几何体类型
 */
function onSetGeometryMesh(activeGeometry, type) {
  // 获取选中的几何体
  const uuid = store.selectMesh.uuid;
  const mesh = this.scene.getObjectByProperty("uuid", uuid);

  // 提取几何体参数
  const geometryData = Object.keys(activeGeometry).map(key => activeGeometry[key]);

  // 创建并更新几何体
  const newGeometry = new THREE[type](...geometryData);
  mesh.geometry = newGeometry;
}

export default {
  onDeleteGeometryMesh,
  onSetGeometryMesh
};
