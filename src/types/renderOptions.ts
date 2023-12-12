
/** 
 * @description renderModel  模型编辑方法ts接口类
*/

export type SetModelType = {
	filePath: string;
	fileType: string;
	scale: number | null | undefined;
	map: any;
	position: any;
	decomposeName: string;
}

export type OnSwitchModelType = SetModelType & {
	modelType: string
}


export type OnSetModelMapType = {
	material: {
		[key: string]: any
	};
	mapId: string;
	meshName: string
}


export type OnSetSystemModelMapType = {
	id: string;
	url: string
}


export type OnGetEditMeshListType = {
	meshName: string | null;
	meshFrom: string | null;
	color: any;
	opacity: number;
	depthWrite: boolean;
	wireframe: boolean;
	visible: boolean;
	type: string
}

export type OnSetModelAmbientLightType = {
	ambientLight: boolean;
	ambientLightColor: any;
	ambientLightIntensity: number;
}

export type OnSetModelDirectionalLightType = {
	planeGeometry?: boolean;
	planeColor?: string;
	planeWidth?: number;
	planeHeight?: number;
	ambientLight?: any;
	ambientLightColor?: string;
	ambientLightIntensity?: number;
	directionalLight: any;
	directionalLightHelper: any;
	directionalLightColor: any;
	directionalLightIntensity: any;
	directionalHorizontal: any;
	directionalVertical: any;
	directionalSistance: any;
	directionaShadow: any;
	pointLight?: boolean;
	pointLightHelper?: boolean;
	pointLightColor?: string;
	pointLightIntensity?: number;
	pointHorizontal?: number;
	pointVertical?: number;
	pointSistance?: number;
	spotLight?: boolean;
	spotLightColor?: string;
	spotLightIntensity?: number;
	spotHorizontal?: number;
	spotVertical?: number;
	spotSistance?: number;
	spotAngle?: number;
	spotPenumbra?: number;
	spotFocus?: number;
	spotCastShadow?: boolean;
	spotLightHelper?: boolean;
	spotDistance?: number
}