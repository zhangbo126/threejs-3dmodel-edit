/**
 * @description 3D模型编辑器核心模块集合
 * @module ModelEditClass
 */

// 场景基础模块
import backgroundModules from "./backgroundModules"; // 背景环境
import lightModules from "./lightModules"; // 光照系统
import helperModules from "./helperModules"; // 辅助工具

// 模型处理模块
import materialModules from "./materialModules"; // 材质系统
import geometryModules from "./geometryModules"; // 几何体系统
import manyModelModules from "./manyModelModules"; // 多模型管理

// 交互功能模块
import stageFlowModules from "./stageFlowModules"; // 后期效果
import animationModules from "./animationModules"; // 动画系统
import tagsModules from "./tagsModules.jsx"; // 标注系统

// 导出所有模块功能
export default {
  // 场景基础
  ...backgroundModules,
  ...lightModules,
  ...helperModules,

  // 模型处理
  ...materialModules,
  ...geometryModules,
  ...manyModelModules,

  // 交互功能
  ...stageFlowModules,
  ...animationModules,
  ...tagsModules
};
