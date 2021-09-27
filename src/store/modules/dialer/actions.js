import { axiosDispatch } from '@/utils/'
import axios from 'axios'

const dialerPath = 'https://api-webphone.mozaik.cloud/v1'
const dialerAdapter = axios.create({
  baseURL: dialerPath,
  headers: {}
})

const dialerActions = {
  openDialer({ getters: { canAccessDialer } }, number) {
    const DialerComponent = document.getElementsByClassName('dialer')[0]?.__vue__

    if (canAccessDialer && [0, 10, 11].includes(number.length)) {
      DialerComponent.close().then(() => {
        DialerComponent.open([0, 11].includes(number.length) ? number : `${number.slice(0, 2)}9${number.slice(2)}`)
      })
    } else {
      DialerComponent.$jusNotification({
        title: 'Ops!',
        type: 'error',
        message: 'Número inválido'
      })
    }
  },

  openBuyDialerDialog({ commit }) {
    commit('setBuyDialerVisible', true)
  },

  dialerLogin({ _ }, loginRequest) {
    return axiosDispatch({
      url: `${dialerPath}/webphone/auth`,
      method: 'POST',
      mutation: 'setLoggedToken',
      data: loginRequest
    }, dialerAdapter)
  },

  loadVoiceServer({ state, commit }) {
    return new Promise((resolve, reject) => {
      dialerAdapter.get(
        '/webphone/voiceserver',
        {
          headers: {
            authorization: `Bearer ${state.currentDialerUser.token}`
          }
        }
      ).then(({ data }) => {
        commit('setVoiceServer', data)
        resolve(data)
      }).catch(err => reject(err))
    })
  },

  loadPauseReasons({ state }, orgId) {
    return axiosDispatch({
      url: `${dialerPath}/webphone/pause/${orgId}`,
      mutation: 'setPauseReasons',
      headers: {
        authorization: `Bearer ${state.currentDialerUser.token}`
      }
    }, dialerAdapter)
  },

  changeServerStatus({ state }, { method, data }) {
    return axiosDispatch({
      url: `${dialerPath}/webphone/servicestatus`,
      mutation: 'setServiceStatus',
      method,
      headers: { authorization: `Bearer ${state.currentDialerUser.token}` },
      data
    }, dialerAdapter)
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
    }, dialerAdapter)
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
    }, dialerAdapter)
  }
}

export default dialerActions
