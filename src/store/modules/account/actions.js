import axiosDispatcher from '@/store/axiosDispatcher.js'
import router from '@/router'

const accountsPath = 'api/accounts'

const accountActions = {
  myAccount() {
    return axiosDispatcher({
      url: `${accountsPath}/my`,
      mutation: 'setUser'
    })
  },
  register({ _ }, loginForm) {
    return axiosDispatcher({
      url: `${accountsPath}/register`,
      method: 'POST',
      data: loginForm
    })
  },
  activate({ _ }, token) {
    return axiosDispatcher({
      url: `${accountsPath}/activate/${token}`,
      method: 'PUT'
    })
  },
  login({ _ }, credentials) {
    // eslint-disable-next-line
    delete axios.defaults.headers.common['Workspace']
    return axiosDispatcher({
      url: `${accountsPath}/token`,
      method: 'POST',
      data: credentials,
      mutation: 'setToken'
    })
  },
  refreshToken({ _ }) {
    return axiosDispatcher({
      url: `${accountsPath}/refresh-token`,
      mutation: 'setToken'
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
      url: `${accountsPath}/reset-password?email=${email}`,
      method: 'PUT'
    })
  },
  resetPassword({ _ }, data) {
    return axiosDispatcher({
      url: `${accountsPath}/new-password/${data.token}`,
      method: 'PUT',
      data: { password: data.password }
    })
  },
  updatePassword({ _ }, form) {
    return axiosDispatcher({
      url: `${accountsPath}/my/update-password`,
      method: 'POST',
      data: form
    })
  },
  ensureWorkspaceAccesss({ _ }, workspaceId) {
    return axiosDispatcher({
      url: `${accountsPath}/workspaces/ensure-workspace-accesss/${workspaceId}`,
      method: 'PATCH',
      mutation: 'setToken'
    })
  }
  // getUserPreferences({ state }) {
  //   return axiosDispatcher({
  //     url: `${accountsPath}/preferences/${state.id}`,
  //     mutation: 'setUserPreferences',
  //   })
  // },
  // updateUserPreferences({ state }, preference) {
  //   return axiosDispatcher({
  //     url: `${accountsPath}/preferences/${state.id}`,
  //     method: 'PATCH',
  //     data: preference,
  //     mutation: 'setUserPreferences',
  //   })
  // },
}

export default accountActions
