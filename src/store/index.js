import Vue from 'vue'
import Vuex from 'vuex'
import workspaceModule from './modules/workspace'
import accountModule from './modules/account'
import importModule from './modules/import'
import campaignModule from './modules/campaign'
import strategyModule from './modules/strategy'
import personModule from './modules/person/index'
import disputeModule from './modules/dispute/index'
import messageModule from './modules/message'
import socketModule from './modules/socket/index'
import whatsappModule from './modules/whatsapp'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    whatsapDialog: false,
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
    },
    toggleWhatsapDialog (state) {
      state.whatsapDialog = !state.whatsapDialog
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
    importModule,
    campaignModule,
    strategyModule,
    personModule,
    disputeModule,
    messageModule,
    socketModule,
    whatsappModule
  }
})
