// import backgroundModules from './backgroundModules' // 背景模块
// // import materialModules from './materialModules' // 材质模块
import stageFlowModules from './stageFlowModules' // 后期/操作模块
import lightModules from './lightModules' // 灯光模块
// // import animaionModules from './animaionModules' // 动画模块
// // import helperModules from './helperModules' // 辅助线模块
// // import geometryModules from './geometryModules' // 几何体模块



function mixin(target: any, ...sources: (lightModules | stageFlowModules)[]) {
	console.log(sources)
	Object.assign(target.prototype, ...sources.map((source: any) => source.prototype));
}

export default class modelApi {

}


mixin(modelApi, new lightModules(), new stageFlowModules());
