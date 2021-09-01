import { axiosDispatch } from '@/utils/'

const dialerPath = 'https://api-webphone.mozaik.cloud/v1'

const dialerActions = {
  // eslint-disable-next-line
  dialerLogin({ _ }, loginRequest) {
    return axiosDispatch({
      url: `${dialerPath}/webphone/auth`,
      method: 'POST',
      mutation: 'setLoggedToken',
      data: loginRequest
    })
  },

  loadVoiceServer({ state }) {
    return axiosDispatch({
      url: `${dialerPath}/webphone/voiceserver`,
      mutation: 'setVoiceServer',
      headers: {
        authorization: `Bearer ${state.currentDialerUser.token}`
      }
    })
  },

  loadPauseReasons({ state }, orgId) {
    return axiosDispatch({
      url: `${dialerPath}/webphone/pause/${orgId}`,
      mutation: 'setPauseReasons',
      headers: {
        authorization: `Bearer ${state.currentDialerUser.token}`
      }
    })
  },

  changeServerStatus({ state }, { method, data }) {
    return axiosDispatch({
      url: `${dialerPath}/webphone/servicestatus`,
      mutation: 'setServiceStatus',
      method,
      headers: { authorization: `Bearer ${state.currentDialerUser.token}` },
      data
    })
  },

  startServerStatus({ dispatch }) {
    return dispatch('changeServerStatus', { method: 'POST', data: {} })
  },

  availableServerStatus({ dispatch }) {
    return dispatch('changeServerStatus', { method: 'PUT', data: { service_member_status: 'available' } })
  },

  refreshServiceStatus({ state }) {
    if (state?.voiceServer?.serviceStatus) {
      this.availableServerStatus(state)
    } else {
      this.startServerStatus(state)
    }
  },

  createNewCall({ state, commit }, destination) {
    commit('createCall')

    const requestCallCommand = state.voiceServer.createRequestCallCommand(
      destination
    )

    return axiosDispatch({
      url: `${dialerPath}/webphone/call/create`,
      mutation: 'setCurrentCallId',
      method: 'POST',
      headers: {
        authorization: `Bearer ${state.currentDialerUser.token}`
      },
      data: requestCallCommand
    })
  },

  clearCurrentCall({ commit }) {
    commit('clearCall')
  },

  deleteCurrentCall({ state }) {
    const currentCallId = state.call.id
    return axiosDispatch({
      url: `${dialerPath}/webphone/call/${currentCallId}`,
      action: this.clearCurrentCall,
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${state.currentDialerUser.token}`
      }
    })
  }
}

export default dialerActions
