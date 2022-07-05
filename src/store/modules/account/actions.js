import router from '@/router'
import { axiosDispatch } from '@/utils'

const vue = () => document.getElementById('app')?.__vue__

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
    commit('callTerminated')
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
      url: `${accountsPath}/my/password`,
      method: 'PATCH',
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
      data,
      action: 'loadAccountProperty'
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
      mutation: 'setAccountProperty',
      action: 'setScheduledCallsRequester'
    })
  },

  confirmActiveScheduledCalls({ getters: { loggedPersonName }, commit, dispatch }) {
    const template = `
      Deseja iniciar as chamadas telefônicas automaticamente para as ligações agendada para hoje?
      <br />
      <br />
      <small>
        Obs: Se você optar por fazer as ligações automaticamente, não se esqueça que iremos entregar ligações diretamente para você, então se sair da sua estação de trabalho, faça logout na Justto ou desligue as chamadas automáticas para não receber ligações enquanto você estiver fora.
      </small>
    `

    dispatch('getPhoneCalls').then(calls => {
      if (calls.length > 0) {
        vue().$confirm(template, `Oi, bem vindo(a) ${loggedPersonName}.`, {
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não',
          dangerouslyUseHTMLString: true,
          customClass: 'confirm-init-call-scheduler',
          closeOnClickModal: false,
          closeOnPressEscape: false,
          showClose: false,
          center: true
        }).then(_ => {
          commit('setAvailableSchedulerdCalls', 'AVAILABLE')
        }).catch(_ => {
          commit('setAvailableSchedulerdCalls', 'UNAVAILABLE')
        })
      } else {
        commit('setAvailableSchedulerdCalls', 'AVAILABLE')
      }
    })
  },

  changeAccountName({ commit }, { name }) {
    commit('setAccountName', { name })
  },

  unlockAccount({ _ }, accountId) {
    return axiosDispatch({
      url: `api/accounts/${accountId}/unblock`,
      method: 'PATCH'
    })
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
