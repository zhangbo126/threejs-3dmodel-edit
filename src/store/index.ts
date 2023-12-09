import { createStore } from 'vuex'

interface StoreOption {
  modelApi: any;
  selectMesh: any
}

export default createStore<StoreOption>({
  state: {
    //当前模型
    modelApi: {},
    //当前材质
    selectMesh: {}
  },
  getters: {
    selectMeshUuid: (state: any) => state.selectMesh?.uuid
  },
  mutations: {
    SET_MODEL_API: (state: any, modelApi: any) => {
      state.modelApi = modelApi
    },
    SELECT_MESH: (state: any, selectMesh: any) => {
      state.selectMesh = selectMesh
    }
  },
  actions: {
  },
  modules: {
  }
})
