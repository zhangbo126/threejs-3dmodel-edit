import { defineStore } from 'pinia'

export const useMeshEditStore = defineStore('useMeshEditStore', {
	state: () => ({
		//当前模型
		modelApi: {},
		//当前材质
		selectMesh: {},
		// 当前drag拖拽类型
		dragType: ''
	}),
	getters: {
		selectMeshUuid: (state) => state.selectMesh.uuid
	},
	actions: {
		setModelApi(modelApi) {
			this.modelApi = modelApi
		},
		selectMeshAction(selectMesh) {
			this.selectMesh = selectMesh
		},
		changeDragType(dragType) {
			this.dragType = dragType
		}
	}
})

export const useIndexedDBStore = defineStore('useIndexedDBStore', {
	state: () => ({
		db: {}
	}),
	getters: {

	},
	actions: {
		setDbApi(db) {
			this.db = db
		}
	}
})