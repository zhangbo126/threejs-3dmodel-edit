import { createStore } from 'vuex'

export default createStore({
  state: {
    //当前模型
    modelApi: {}
  },
  getters: {
  },
  mutations: {
    SET_MODEL_API: (state, modelApi) => {
      state.modelApi = modelApi
    }
  },
  actions: {
  },
  modules: {
  }
})
