import { createStore } from 'vuex'

export default createStore({
  state: {
    //当前模型
    modelApi: {},
    //当前材质
    selectMesh:{}
  },
  getters: {
  },
  mutations: {
    SET_MODEL_API: (state, modelApi) => {
      state.modelApi = modelApi
    },
    SELECT_MESH: (state, selectMesh) => {
      state.selectMesh = selectMesh
    }
  },
  actions: {
  },
  modules: {
  }
})
