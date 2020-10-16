import axiosDispatcher from '@/store/axiosDispatcher.js'
import router from '@/router'

const actions = {
  myAccount() {
    return axiosDispatcher({
      url: 'api/accounts/my',
      mutation: 'setUser'
    })
  },
  register({ _ }, loginForm) {
    return axiosDispatcher({
      url: 'api/accounts/register',
      method: 'POST',
      data: loginForm
    })
  },
  activate({ _ }, token) {
    return axiosDispatcher({
      url: `api/accounts/activate/${token}`,
      method: 'PUT'
    })
  },
  login({ _ }, credentials) {
    // eslint-disable-next-line
    delete axios.defaults.headers.common['Workspace']
    return axiosDispatcher({
      url: 'api/accounts/token',
      method: 'POST',
      data: credentials,
      mutation: 'setToken'
    })
  },
  refreshToken({ _ }) {
    return axiosDispatcher({
      url: 'api/accounts/refresh-token',
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
      url: `api/accounts/reset-password?email=${email}`,
      method: 'PUT'
    })
  },
  resetPassword({ _ }, data) {
    return axiosDispatcher({
      url: `api/accounts/new-password/${data.token}`,
      method: 'PUT',
      data: { password: data.password }
    })
  },
  updatePassword({ _ }, form) {
    return axiosDispatcher({
      url: 'api/accounts/my/update-password',
      method: 'POST',
      data: form
    })
  },
  ensureWorkspaceAccesss({ _ }, workspaceId) {
    return axiosDispatcher({
      url: `api/accounts/workspaces/ensure-workspace-accesss/${workspaceId}`,
      method: 'PATCH',
      mutation: 'setToken'
    })
  }
  // getUserPreferences({ state }) {
  //   return axiosDispatcher({
  //     url: `api/accounts/preferences/${state.id}`,
  //     mutation: 'setUserPreferences',
  //   })
  // },
  // updateUserPreferences({ state }, preference) {
  //   return axiosDispatcher({
  //     url: `api/accounts/preferences/${state.id}`,
  //     method: 'PATCH',
  //     data: preference,
  //     mutation: 'setUserPreferences',
  //   })
  // },
}

export default actions
