import Vue from 'vue'
import Vuex from 'vuex'
import accountModule from './modules/account'
import banksList from '@/utils/banksList'
import billingModule from './modules/billing'
import campaignModule from './modules/campaign'
import dashboardModule from './modules/dashboard'
import disputeModule from './modules/dispute/index'
import documentModule from './modules/document'
import importModule from './modules/import'
import messageModule from './modules/message'
import personModule from './modules/person/index'
import socketModule from './modules/socket/index'
import strategyAdminPanelModule from './modules/strategy-adminpanel'
import strategyModule from './modules/strategy'
import tagModule from './modules/tag'
import userModule from './modules/user'
import workspaceModule from './modules/workspace'

Vue.use(Vuex)

let ghostMode = localStorage.getItem('jusghostmode')
if (ghostMode) {
  ghostMode = ghostMode === 'true' || ghostMode === true
}

export default new Vuex.Store({
  state: {
    loading: false,
    banksList: banksList,
    ghostMode: ghostMode,
    statesList: ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'],
  },
  getters: {
    banksList: state => state.banksList,
    ghostMode: state => state.ghostMode,
  },
  mutations: {
    showLoading(state) {
      state.loading = true
    },
    hideLoading(state) {
      state.loading = false
    },
    setGhostMode(state, value) {
      state.ghostMode = value
      localStorage.setItem('jusghostmode', value)
    },
  },
  actions: {
    showLoading({ commit }) {
      commit('showLoading')
    },
    hideLoading({ commit }) {
      commit('hideLoading')
    },
  },
  modules: {
    accountModule,
    billingModule,
    campaignModule,
    dashboardModule,
    disputeModule,
    documentModule,
    importModule,
    messageModule,
    personModule,
    socketModule,
    strategyAdminPanelModule,
    strategyModule,
    tagModule,
    userModule,
    workspaceModule,
  },
})
