
/**
 * @describe 后期/操作模块方法
 * @function onSetUnrealBloomPass 设置辉光效果
 * @function setModelMeshDecompose 模型拆分
 * @function setModelMeshDrag 模型材质可拖拽
 * @function getMeshDragPosition 获取模型材质位拖拽置
 * @function onSetFlowColor 修改辉光颜色
 */

import * as THREE from 'three' //导入整个 three.js核心库
import TWEEN from "@tweenjs/tween.js";

export default class stageFlowMoelues {
	name: string
	constructor() {
		this.name = 'stageFlow'
	}
	onSetFlowColor() {
        console.log(this.name)
	}
}