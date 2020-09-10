import Vue from 'vue'
import router from '@/router'
import axiosDispatcher from '@/store/axiosDispatcher.js'
import { isJusttoUser } from '@/utils/jusUtils'

const account = {
  state: {
    id: '',
    name: '',
    email: '',
    token: localStorage.getItem('justoken') || '',
    devs: ['josewilliam@justto.com.br', 'lucas@justto.com.br', 'daniel@justto.com.br', 'gabriel@justto.com.br', 'guilherme@justto.com.br'],
  },
  mutations: {
    setToken(state, resp) {
      const token = resp.token
      // eslint-disable-next-line
      delete axios.defaults.headers.common['Authorization']

      Vue.set(state, 'token', token)
      // if (token) state.token = token

      // eslint-disable-next-line
      axios.defaults.headers.common['Authorization'] = token
      localStorage.removeItem('justoken')
      localStorage.setItem('justoken', token)
    },
    logout(state) {
      state.id = ''
      state.name = ''
      state.email = ''
      state.token = ''
    },
    setUser(state, response) {
      if (response.id) state.id = response.id
      if (response.name) state.name = response.name
      if (response.email) state.email = response.email
    },
  },
  actions: {
    myAccount() {
      return axiosDispatcher({
        url: 'api/accounts/my',
        mutation: 'setUser',
      })
    },
    register({ commit }, loginForm) {
      return axiosDispatcher({
        url: 'api/accounts/register',
        method: 'POST',
        data: loginForm,
      })
    },
    activate({ commit }, token) {
      return axiosDispatcher({
        url: `api/accounts/activate/${token}`,
        method: 'PUT',
      })
    },
    login({ commit }, credentials) {
      // eslint-disable-next-line
      delete axios.defaults.headers.common['Workspace']
      return axiosDispatcher({
        url: 'api/accounts/token',
        method: 'POST',
        data: credentials,
        mutation: 'setToken',
      }).catch(() => {
        localStorage.removeItem('justoken')
      })
    },
    refreshToken({ commit }) {
      return axiosDispatcher({
        url: 'api/accounts/refresh-token',
        mutation: 'setToken',
      }).catch(() => {
        localStorage.removeItem('justoken')
      })
    },
    logout({ commit }, options) {
      commit('logout')
      commit('clearWorkspace')
      commit('clearDisputes')
      commit('clearDisputeTab')
      commit('clearDashboard')
      localStorage.removeItem('justoken')
      // eslint-disable-next-line
      delete axios.defaults.headers.common['Authorization']
      if (options && options.redirect === false) {
      } else router.push('/login')
    },
    forgotPassword({ commit }, email) {
      return axiosDispatcher({
        url: `api/accounts/reset-password?email=${email}`,
        method: 'PUT',
      })
    },
    resetPassword({ commit }, data) {
      return axiosDispatcher({
        url: `api/accounts/new-password/${data.token}`,
        method: 'PUT',
        data: { password: data.password },
      })
    },
    updatePassword({ commit }, form) {
      return axiosDispatcher({
        url: 'api/accounts/my/update-password',
        method: 'POST',
        data: form,
      })
    },
    ensureWorkspaceAccesss({ commit }, workspaceId) {
      return axiosDispatcher({
        url: `api/accounts/workspaces/ensure-workspace-accesss/${workspaceId}`,
        method: 'PATCH',
        mutation: 'setToken',
      })
    },
  },
  getters: {
    accountToken: state => state.token,
    isLoggedIn: state => !!state.token,
    accountId: state => state.id,
    accountEmail: state => state.email,
    isJusttoAdmin: state => isJusttoUser(state.email),
    isJusttoDev: state => state.devs.indexOf(state.email) !== -1,
  },
}

export default account
