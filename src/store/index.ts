import { createStore } from 'vuex'

interface StoreOption {
  modelApi: any;
  selectMesh: {
    [key:string]: any
  }
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
    SET_MODEL_API: (state: any, modelApi: Object) => {
      state.modelApi = modelApi
    },
    SELECT_MESH: (state: any, selectMesh: Object) => {
      state.selectMesh = selectMesh
    }
  },
  actions: {
  },
  modules: {
  }
})
