import Vue from 'vue'
import Vuex from 'vuex'

// MODULES
import accountModule from './modules/account'
import billingModule from './modules/billing'
import campaignModule from './modules/campaign'
import dashboardModule from './modules/dashboard'
import disputeModule from './modules/dispute/index'
import documentModule from './modules/document'
import importModule from './modules/import'
import managementModule from './modules/management'
import messageModule from './modules/message'
import personModule from './modules/person/index'
import socketModule from './modules/socket/index'
import strategyAdminPanelModule from './modules/strategy-adminpanel'
import strategyModule from './modules/strategy'
import tagModule from './modules/tag'
import userModule from './modules/user'
import workspaceModule from './modules/workspace'

// CONSTANTS
import brazilianStates from './brazilianStates'
import banksList from '@/utils/banksList'

Vue.use(Vuex)

let ghostMode = localStorage.getItem('jusghostmode')
if (ghostMode) ghostMode = ghostMode === 'true' || ghostMode === true

export default new Vuex.Store({
  state: {
    loading: false,
    ghostMode,
    banksList,
    brazilianStates
  },
  getters: {
    loading: state => state.loading,
    ghostMode: state => state.ghostMode,
    banksList: state => state.banksList,
    brazilianStates: state => state.brazilianStates
  },
  mutations: {
    showLoading: (state) => (state.loading = true),
    hideLoading: (state) => (state.loading = false),
    setGhostMode: (state, value) => (state.ghostMode = value)
  },
  actions: {
    showLoading({ commit }) {
      commit('showLoading')
    },
    hideLoading({ commit }) {
      commit('hideLoading')
    },
    setGhostMode({ commit }, value) {
      commit('setGhostMode', value)
      localStorage.setItem('jusghostmode', value)
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
    managementModule,
    messageModule,
    personModule,
    socketModule,
    strategyAdminPanelModule,
    strategyModule,
    tagModule,
    userModule,
    workspaceModule
  }
})
