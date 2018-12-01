import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import workspace from './modules/workspace'
import account from './modules/account'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    stateList: ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'],
    importList: [],
    loading: false
  },
  getters: {
  },
  mutations: {
    showLoading (state) {
      state.loading = true
    },
    hideLoading (state) {
      state.loading = false
    }
  },
  actions: {
  },
  modules: {
    auth,
    workspace,
    account
  }
})
