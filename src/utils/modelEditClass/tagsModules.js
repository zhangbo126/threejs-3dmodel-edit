
/**
	 * @describe 后期/操作模块方法
	 * @function setDragTag 设置当前拖拽标签信息
	 * @function create3dTags 创建3d标签
	 * @function updateTagElement 更新标签元素

*/


import * as THREE from 'three'
import TWEEN from "@tweenjs/tween.js";
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { onlyKey } from '@/utils/utilityFunction'
import { ElIcon, ElMessage, ElPopover, ElButton } from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { h, createApp } from "vue";


function setDragTag(tag) {
	this.dragTag = tag
	this.dragTag.id = onlyKey(4, 7)
}

function create3dTags() {

	const { clientHeight, clientWidth, offsetLeft, offsetTop } = this.container
	const { clientX, clientY, name } = this.dragTag

	// 计算鼠标在屏幕上的坐标
	this.mouse.x = ((clientX - offsetLeft) / clientWidth) * 2 - 1
	this.mouse.y = -((clientY - offsetTop) / clientHeight) * 2 + 1
	this.raycaster.setFromCamera(this.mouse, this.camera);
	const intersects = this.raycaster.intersectObjects(this.scene.children, true);

	if (intersects.length > 0) {
		var element = document.createElement('div');
		// 创建容器标签
		const backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')'
		const len = this.dragTagList.length + 1
		// 创建3d标签
		const tagvMode = createApp({
			render() {
				return (
					<div>
						<div className="element-tag"
							style={{ width: 60 + 'px', height: 40 + 'px', fontSize: 6 + 'px', color: '#ffffffbf', backgroundColor }}>
							<span className='tag-txt'>
								{`标签-${len}`}
							</span>
						</div>
						<div className='tag-icon' ><ElIcon >{h(ElementPlusIconsVue[name])}</ElIcon></div>
					</div>
				)
			}
		});

		const vNode = tagvMode.mount(document.createElement('div'))
		element.appendChild(vNode.$el)

		var cssObject = new CSS3DObject(element);
		const { x, y, z } = intersects[0].point
		cssObject.position.set(x, y, z);
		cssObject.scale.set(.01, .01, .01)
		const { uuid, position, element: { innerHTML, innerText } } = cssObject
		const tag = {
			uuid,
			positionX: position.x,
			positionY: position.y,
			positionZ: position.z,
			innerHTML,
			innerText,
			width: 60,
			height: 40,
			fontSize: 6,
			backgroundColor,
			color: '#ffffffbf',
			iconColor: '#fff',
			iconSize: 12,
			hover: false
		}

		if (this.dragTagList.length == 0) {
			this.container.appendChild(this.css3DRenderer.domElement);
		}
		this.dragTagList.push(tag)
		this.scene.add(cssObject)

	} else {
		ElMessage.warning('当前角度无法获取鼠标位置请调整“相机角度”在添加')
	}
}

function clearSceneTags() {
	if (this.dragTagList.length == 0) return false
	this.dragTagList.forEach((v) => {
		const object = this.scene.getObjectByProperty('uuid', v.uuid)
		this.scene.remove(object)
		var element = object.element;
		if (element && element.parentNode) {
			element.parentNode.removeChild(element);
		}
	})
	this.dragTagList = []
	this.container.removeChild(this.css3DRenderer.domElement);

}

function deleteTag(uuid) {

	const object = this.scene.getObjectByProperty('uuid', uuid)
	this.scene.remove(object)
	var element = object.element;
	if (element && element.parentNode) {
		element.parentNode.removeChild(element);
	}

	this.dragTagList = this.dragTagList.filter(v => v.uuid != uuid)

	if (this.dragTagList.length == 0) {
		this.container.removeChild(this.css3DRenderer.domElement);
		return false
	}

}


function updateTagElement(tag) {
	const object = this.scene.getObjectByProperty('uuid', tag.uuid)
	if (object) {
		const element = object.element.querySelector('.element-tag')
		const iconElement = object.element.querySelector('.tag-icon')
		const txtElement = object.element.querySelector('.tag-txt')
		const { height, backgroundColor, width,
			fontSize, color, innerText, iconColor,
			iconSize, positionY, positionX, positionZ } = tag

		element.style.height = height + 'px'
		element.style.backgroundColor = backgroundColor
		element.style.boxShadow = `0px 0px 4px ${backgroundColor}`
		element.style.width = width + 'px'
		element.style.fontSize = fontSize + 'px'
		element.style.color = color

		txtElement.innerText = innerText

		iconElement.style.fontSize = iconSize + 'px'
		iconElement.style.color = iconColor

		// 修改坐标位置
		const Tween = new TWEEN.Tween(object.position)
		const endPosition = {
			x: positionX,
			y: positionY,
			z: positionZ
		}
		Tween.to(endPosition, 500)
		Tween.onUpdate((val) => {
			object.position.set(val.x || 0, val.y || 0, val.z || 0)
		})
		Tween.start();

		// 更新拖拽列表标签数据
		const activeTag = this.dragTagList.find(v => v.uuid == tag.uuid)
		Object.assign(activeTag, tag)
	}

}



export default {
	create3dTags,
	setDragTag,
	clearSceneTags,
	deleteTag,
	updateTagElement
}