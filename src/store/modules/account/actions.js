import router from '@/router'
import { axiosDispatch } from '@/utils'
import * as ticketListModeTypes from '@/constants/ticketListMode'

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

  logout({ commit, dispatch }, options) {
    commit('logout')
    commit('clearWorkspace')
    commit('clearDisputes')
    commit('clearDisputeTab')
    commit('clearDashboard')
    dispatch('callTerminated')
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

      if (calls.length > 0) {
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
      } else {
        commit('setAvailableSchedulerdCalls', 'AVAILABLE')
        commit('setPreventScheduleCallsConfirmation', false)
      }
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
  },

  /**
   * Calcula valor inicial da property TICKET_LIST_MODE,
   * caso não tenha valor válido ainda.
   *
   * @param {*} getters
   * @param {*} dispatch
   * @returns
   */
  initTicketListModeProperty({
    getters: {
      userProperties: {
        TICKET_LIST_MODE,
        CUSTOM_HOME,
        PREFERRED_INTERFACE
      }, showNegotiationTypeMenu
    }, dispatch
  }) {
    if (process.env.NODE_ENV !== 'production') {
      console.table({ TICKET_LIST_MODE, CUSTOM_HOME, PREFERRED_INTERFACE, showNegotiationTypeMenu })
    }

    // Verifica se SHOW_NEGOTIATION_TYPE_MENU está habilitado na Workapace.
    if (!showNegotiationTypeMenu) return

    // Varifica se TICKET_LIST_MODE não tem valor válido.
    if (Object.values(ticketListModeTypes).includes(TICKET_LIST_MODE)) return

    let mode = ticketListModeTypes.TICKET

    // TODO: Revalidar lógica.
    if (['/management', '/negotiation'].includes(CUSTOM_HOME)) {
      mode = {
        '/management': ticketListModeTypes.MANAGEMENT,
        '/negotiation': ticketListModeTypes.TICKET
      }[CUSTOM_HOME]
    } else if (['DISPUTE', 'NEGOTIATION'].includes(PREFERRED_INTERFACE)) {
      mode = {
        DISPUTE: ticketListModeTypes.MANAGEMENT,
        NEGOTIATION: ticketListModeTypes.TICKET
      }[PREFERRED_INTERFACE]
    }

    dispatch('setAccountProperty', { TICKET_LIST_MODE: mode }).then(res => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('setAccountProperty', res)
      }
    })
  }
}

export default accountActions
