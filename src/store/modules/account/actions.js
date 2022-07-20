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
    commit('setPreventScheduleCallsConfirmation', true)

    dispatch('getPhoneCalls').then(calls => {
      const template = calls.length > 0 ? `
        Temos ${calls.length} ligações agendas para hoje. Deseja que o sistema faça essas ligações para você? 
        <br />
        <br />
        <br />
        <br />
        <br />
        <small>
          Obs: Para garantir que o maior número de ligações sejam efetivas, lembre-se de se manter logada e ficar em sua estação de trabalho. <b>Se precisar sair, mesmo que por alguns minutos, faça logout da plataforma</b> para não perder as chamadas, assim quando retornar o sistema irá retornar as ligações automáticas agendadas.
        </small>
      ` : `
        Não temos ligações agendas para hoje. Deseja realmente habilitar a discagem automática?
        <br />
        <br />
        <br />
        <br />
        <br />
        <small>
          Obs: Para garantir que o maior número de ligações sejam efetivas, lembre-se de se manter logada e ficar em sua estação de trabalho. <b>Se precisar sair, mesmo que por alguns minutos, faça logout da plataforma</b> para não perder as chamadas, assim quando retornar o sistema irá retornar as ligações automáticas agendadas.
        </small>
      `

      vue().$confirm(template, `Oi, ${loggedPersonName}, tudo bem?`, {
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
        commit('setPreventScheduleCallsConfirmation', false)
        commit('setAvailableSchedulerdCalls', 'UNAVAILABLE')
      })
    }).catch(error => {
      this.$jusNotification({ error })
      commit('setAvailableSchedulerdCalls', 'UNAVAILABLE')
    })
    // .finally(() => commit('setPreventScheduleCallsConfirmation', false))
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
