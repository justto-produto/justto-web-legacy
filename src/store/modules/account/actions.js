import router from '@/router'
import axiosDispatcher from '@/store/axiosDispatcher.js'

const accountPath = 'api/accounts'

const accountActions = {
  myAccount() {
    return axiosDispatcher({
      url: `${accountPath}/my`,
      mutation: 'setUser',
    })
  },
  register({ commit }, loginForm) {
    return axiosDispatcher({
      url: `${accountPath}/register`,
      method: 'POST',
      data: loginForm,
    })
  },
  activate({ commit }, token) {
    return axiosDispatcher({
      url: `${accountPath}/activate/${token}`,
      method: 'PUT',
    })
  },
  login({ commit }, credentials) {
    // eslint-disable-next-line
    delete axios.defaults.headers.common['Workspace']
    return axiosDispatcher({
      url: `${accountPath}/token`,
      method: 'POST',
      data: credentials,
      mutation: 'setToken',
    }).catch(() => {
      localStorage.removeItem('justoken')
    })
  },
  refreshToken({ commit }) {
    return axiosDispatcher({
      url: `${accountPath}/refresh-token`,
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
  forgotPassword({ _ }, email) {
    return axiosDispatcher({
      url: `${accountPath}/reset-password?email=${email}`,
      method: 'PUT',
    })
  },
  resetPassword({ _ }, data) {
    return axiosDispatcher({
      url: `${accountPath}/new-password/${data.token}`,
      method: 'PUT',
      data: { password: data.password },
    })
  },
  updatePassword({ _ }, form) {
    return axiosDispatcher({
      url: `${accountPath}/my/update-password`,
      method: 'POST',
      data: form,
    })
  },
  ensureWorkspaceAccesss({ _ }, workspaceId) {
    return axiosDispatcher({
      url: `${accountPath}/workspaces/ensure-workspace-accesss/${workspaceId}`,
      method: 'PATCH',
      mutation: 'setToken',
    })
  },
  updateUserPreferences({ dispatch }, preference) {
    return axiosDispatcher({
      url: `${accountPath}/my/property/`,
      method: 'PUT',
      data: preference,
    }).then(() => dispatch('myAccount'))
  },
}

export default accountActions
