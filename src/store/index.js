import Vue from 'vue'
import Vuex from 'vuex'

// MODULES
import accountModule from './modules/account'
import actionsModules from './modules/actions'
import billingModule from './modules/billing'
import campaignModule from './modules/campaign'
import dashboardModule from './modules/dashboard'
import disputeModule from './modules/dispute/index'
import documentModule from './modules/document'
import enrichmentModule from './modules/enrichment'
import importModule from './modules/import'
import managementModule from './modules/management'
import messageModule from './modules/message'
import negotiationOmnichannelModule from './modules/negotiation/omnichannel'
import negotiationOverviewModule from './modules/negotiation/overview'
import negotiationTicketsModule from './modules/negotiation/tickets'
import personModule from './modules/person/index'
import socketModule from './modules/socket/index'
import strategyAdminPanelModule from './modules/strategy-adminpanel'
import strategyModule from './modules/strategy'
import tagModule from './modules/tag'
import userModule from './modules/user'
import workspaceModule from './modules/workspace'
import configurationsModule from './modules/configurations'

// CONSTANTS
import banksList from '@/constants/banksList'
import brazilianStates from '@/constants/brazilianStates'

Vue.use(Vuex)

let ghostMode = localStorage.getItem('jusghostmode')
if (ghostMode) ghostMode = ghostMode === 'true' || ghostMode === true

export default new Vuex.Store({
  state: {
    banksList,
    brazilianStates,
    ghostMode,
    loading: false,
    windowHeight: 0,
    window: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  },
  getters: {
    banksList: state => state.banksList,
    brazilianStates: state => state.brazilianStates,
    ghostMode: state => state.ghostMode,
    loading: state => state.loading,
    windowHeight: state => state.windowHeight,
    getWindowHeight: state => state.window.height,
    getWindowWidth: state => state.window.width,
    getWindowMode: state => (state.window.width <= 900 ? 'mobile' : state.window.width <= 1200 ? 'tablet' : 'desktop')
  },
  mutations: {
    setGhostMode: (state, value) => (state.ghostMode = value),
    showLoading: (state) => (state.loading = true),
    hideLoading: (state) => (state.loading = false),
    setHeight: (state, value) => (state.windowHeight = value),
    setWindowHeight: (state, height) => Vue.set(state.window, 'height', height),
    setWindowWidth: (state, width) => Vue.set(state.window, 'width', width)

  },
  actions: {
    setGhostMode({ commit }, value) {
      commit('setGhostMode', value)
      localStorage.setItem('jusghostmode', value)
    },
    showLoading({ commit }) {
      commit('showLoading')
    },
    hideLoading({ commit }) {
      commit('hideLoading')
    },
    setHeight({ commit }, value) {
      commit('setHeight', value)
    },
    setWindowGeometry({ commit }, { innerHeight, innerWidth }) {
      commit('setWindowHeight', innerHeight)
      commit('setWindowWidth', innerWidth)
    }
  },
  modules: {
    accountModule,
    actionsModules,
    billingModule,
    campaignModule,
    dashboardModule,
    disputeModule,
    documentModule,
    enrichmentModule,
    importModule,
    managementModule,
    messageModule,
    negotiationOmnichannelModule,
    negotiationOverviewModule,
    negotiationTicketsModule,
    personModule,
    socketModule,
    strategyAdminPanelModule,
    strategyModule,
    tagModule,
    userModule,
    workspaceModule,
    configurationsModule
  }
})
