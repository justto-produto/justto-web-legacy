import router from '@/router'
import { axiosDispatch } from '@/utils'

const accountsPath = 'api/accounts'

const accountActions = {
  myAccount() {
    return axiosDispatch({
      url: `${accountsPath}/my`,
      mutation: 'setUser'
    })
  },
  register({ _ }, loginForm) {
    return axiosDispatch({
      url: `${accountsPath}/register`,
      method: 'POST',
      data: loginForm
    })
  },
  activate({ _ }, token) {
    return axiosDispatch({
      url: `${accountsPath}/activate/${token}`,
      method: 'PUT'
    })
  },
  login({ _ }, credentials) {
    // eslint-disable-next-line
    delete axios.defaults.headers.common['Workspace']
    return axiosDispatch({
      url: `${accountsPath}/token`,
      method: 'POST',
      data: credentials,
      mutation: 'setToken'
    })
  },
  refreshToken({ _ }) {
    return axiosDispatch({
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
    return axiosDispatch({
      url: `${accountsPath}/reset-password?email=${email}`,
      method: 'PUT'
    })
  },
  resetPassword({ _ }, data) {
    return axiosDispatch({
      url: `${accountsPath}/new-password/${data.token}`,
      method: 'PUT',
      data: { password: data.password }
    })
  },
  updatePassword({ _ }, form) {
    return axiosDispatch({
      url: `${accountsPath}/my/update-password`,
      method: 'POST',
      data: form
    })
  },
  ensureWorkspaceAccesss({ _ }, workspaceId) {
    return axiosDispatch({
      url: `${accountsPath}/workspaces/ensure-workspace-accesss/${workspaceId}`,
      method: 'PATCH',
      mutation: 'setToken'
    })
  },
  createWorkpace({ _ }, object) {
    return axiosDispatch({
      url: `${accountsPath}/workspaces`,
      method: 'POST',
      data: object,
      mutation: 'setWorkspace'
    })
  },
  setAccountProperty({ _ }, data) {
    return axiosDispatch({
      url: `${accountsPath}/my/property`,
      method: 'PUT',
      data
    })
  },
  getAccountProperty({ _ }, property) {
    return axiosDispatch({
      url: `${accountsPath}/my/property/${property}`,
      method: 'GET'
    })
  },
  loadAccountProperty({ _ }) {
    return axiosDispatch({
      url: `${accountsPath}/my/property`,
      method: 'GET',
      mutation: 'setAccountProperty'
    })
  },
  changeAccountName({ commit }, { name }) {
    commit('setAccountName', { name })
  }
  // getUserPreferences({ state }) {
  //   return axiosDispatch({
  //     url: `${accountsPath}/preferences/${state.id}`,
  //     mutation: 'setUserPreferences',
  //   })
  // },
  // updateUserPreferences({ state }, preference) {
  //   return axiosDispatch({
  //     url: `${accountsPath}/preferences/${state.id}`,
  //     method: 'PATCH',
  //     data: preference,
  //     mutation: 'setUserPreferences',
  //   })
  // },
}

export default accountActions
