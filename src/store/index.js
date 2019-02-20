import Vue from 'vue'
import Vuex from 'vuex'
import workspaceModule from './modules/workspace'
import accountModule from './modules/account'
import whatsappModule from './modules/whatsapp'
import importModule from './modules/import'
import campaignModule from './modules/campaign'
import strategyModule from './modules/strategy'
import personModule from './modules/person'
import disputeModule from './modules/dispute'
import messageModule from './modules/message'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    statesList: ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO']
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
    showLoading ({ commit }) {
      commit('showLoading')
    },
    hideLoading ({ commit }) {
      commit('hideLoading')
    }
  },
  modules: {
    accountModule,
    workspaceModule,
    whatsappModule,
    importModule,
    campaignModule,
    strategyModule,
    personModule,
    disputeModule,
    messageModule
  }
})
