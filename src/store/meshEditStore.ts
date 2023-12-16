import { defineStore } from 'pinia'

type useMeshEditStoreType = {
	modelApi: {
		[key: string]: any
	},
	selectMesh: {
		[key: string]: any
	},
}

export const useMeshEditStore = defineStore('useMeshEditStore', {
	state: (): useMeshEditStoreType => ({
		//当前模型
		modelApi: {},
		//当前材质
		selectMesh: {}
	}),
	getters: {
		selectMeshUuid: (state) => state.selectMesh.uuid
	},
	actions: {
		setModelApi(modelApi: {}) {
			this.modelApi = modelApi
		},
		selectMeshAction(selectMesh: {}) {
			this.selectMesh = selectMesh
		}
	}
}) 