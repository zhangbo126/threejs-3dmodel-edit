/**
 * 标注系统模块
 *
 * @module TagsModules
 * @description 提供3D场景中标注点的创建、更新、删除等功能
 *
 * @exports {Object} default - 导出的方法集合
 * @property {Function} setDragTag - 设置当前拖拽标签信息
 * @property {Function} create3dTags - 在3D场景中创建标注点
 * @property {Function} clearSceneTags - 清除场景中所有标注
 * @property {Function} deleteTag - 删除指定标注点
 * @property {Function} updateTagElement - 更新标注点样式和位置
 */

import TWEEN from "@tweenjs/tween.js";
import { CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";
import { onlyKey } from "@/utils/utilityFunction";
import { ElIcon, ElMessage } from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { h, createApp } from "vue";

/**
 * 设置当前拖拽标签信息
 * @param {Object} tag - 标签配置信息
 */
function setDragTag(tag) {
  this.dragTag = tag;
  this.dragTag.id = onlyKey(4, 7);
}

/**
 * 在3D场景中创建标注点
 */
function create3dTags() {
  const { clientHeight, clientWidth, offsetLeft, offsetTop } = this.container;
  const { clientX, clientY, name: iconName } = this.dragTag;

  // 计算标注点在3D空间的位置
  this.mouse.x = ((clientX - offsetLeft) / clientWidth) * 2 - 1;
  this.mouse.y = -((clientY - offsetTop) / clientHeight) * 2 + 1;
  this.raycaster.setFromCamera(this.mouse, this.camera);
  const intersects = this.raycaster.intersectObjects(this.scene.children, true);

  if (intersects.length > 0) {
    // 创建标注点DOM元素
    const element = document.createElement("div");
    const backgroundColor = `rgba(0,127,127,${Math.random() * 0.5 + 0.25})`;
    const tagIndex = this.dragTagList.length + 1;

    // 创建标注点Vue组件
    const tagsMode = createApp({
      render() {
        return (
          <div>
            <div
              className="text-center"
              style={{
                width: "60px",
                height: "40px",
                fontSize: "6px",
                color: "#ffffffbf",
                backgroundColor
              }}
            >
              <span className="tag-txt">{`标签-${tagIndex}`}</span>
            </div>
            <div className="text-center text-[#fff] text-[12px]">
              <ElIcon>{h(ElementPlusIconsVue[iconName])}</ElIcon>
            </div>
          </div>
        );
      }
    });

    const vNode = tagsMode.mount(document.createElement("div"));
    element.appendChild(vNode.$el);

    // 创建CSS3D对象并设置位置
    const cssObject = new CSS3DObject(element);
    const { x, y, z } = intersects[0].point;
    cssObject.position.set(x, y, z);
    cssObject.scale.set(0.01, 0.01, 0.01);

    // 保存标注点信息
    const {
      uuid,
      position,
      element: { innerText }
    } = cssObject;

    const tag = {
      uuid,
      positionX: position.x,
      positionY: position.y,
      positionZ: position.z,
      innerText,
      width: 60,
      height: 40,
      fontSize: 6,
      backgroundColor,
      color: "#ffffffbf",
      iconColor: "#fff",
      iconSize: 12,
      iconName,
      hover: false
    };

    // 首次创建标注时添加CSS3D渲染器
    if (this.dragTagList.length === 0) {
      this.container.appendChild(this.css3DRenderer.domElement);
    }

    this.dragTagList.push(tag);
    this.scene.add(cssObject);
  } else {
    ElMessage.warning("当前视角无法获取标注位置,请调整相机角度后重试");
  }
}

/**
 * 清除场景中所有标注
 * @returns {boolean} 是否清除成功
 */
function clearSceneTags() {
  if (this.dragTagList.length === 0) return false;

  // 移除所有标注点
  this.dragTagList.forEach(tag => {
    const object = this.scene.getObjectByProperty("uuid", tag.uuid);
    this.scene.remove(object);
    if (object.element?.parentNode) {
      object.element.parentNode.removeChild(object.element);
    }
  });

  this.dragTagList = [];
  this.container.removeChild(this.css3DRenderer.domElement);
}

/**
 * 删除指定标注点
 * @param {string} uuid - 标注点UUID
 * @returns {boolean} 是否删除成功
 */
function deleteTag(uuid) {
  const object = this.scene.getObjectByProperty("uuid", uuid);
  this.scene.remove(object);

  if (object.element?.parentNode) {
    object.element.parentNode.removeChild(object.element);
  }

  this.dragTagList = this.dragTagList.filter(tag => tag.uuid !== uuid);

  // 删除最后一个标注时移除CSS3D渲染器
  if (this.dragTagList.length === 0) {
    this.container.removeChild(this.css3DRenderer.domElement);
    return false;
  }
}

/**
 * 更新标注点样式和位置
 * @param {Object} tag - 标注点新的配置信息
 */
function updateTagElement(tag) {
  const object = this.scene.getObjectByProperty("uuid", tag.uuid);
  if (!object) return;

  // 更新DOM元素样式
  const element = object.element.querySelector(".element-tag");
  const iconElement = object.element.querySelector(".tag-icon");
  const txtElement = object.element.querySelector(".tag-txt");

  const { height, backgroundColor, width, fontSize, color, innerText, iconColor, iconSize, positionX, positionY, positionZ } =
    tag;

  Object.assign(element.style, {
    height: `${height}px`,
    backgroundColor,
    boxShadow: `0px 0px 4px ${backgroundColor}`,
    width: `${width}px`,
    fontSize: `${fontSize}px`,
    color
  });

  txtElement.innerText = innerText;

  Object.assign(iconElement.style, {
    fontSize: `${iconSize}px`,
    color: iconColor
  });

  // 创建位置过渡动画
  new TWEEN.Tween(object.position)
    .to({ x: positionX, y: positionY, z: positionZ }, 500)
    .onUpdate(val => {
      object.position.set(val.x || 0, val.y || 0, val.z || 0);
    })
    .start();

  // 更新标注数据
  const activeTag = this.dragTagList.find(item => item.uuid === tag.uuid);
  Object.assign(activeTag, tag);
}

export default {
  create3dTags,
  setDragTag,
  clearSceneTags,
  deleteTag,
  updateTagElement
};
