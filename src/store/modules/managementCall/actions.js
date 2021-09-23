// https://justto.atlassian.net/browse/SAAS-4522
import { Call } from '@/models/managementCall/currentCall'
import { axiosDispatch } from '@/utils'

import { CALL_STATUS } from '@/constants/callStatus'

const DEFAULT_JUSTTO_MANAGEMENT_CALL = '{"currentCall":null,"callQueue":[],"appInstance":null}'
const dialerApi = 'api/dialer'

export default {
  ativeAppToCall({ commit, getters: { getAppInstance } }, active = false) {
    return new Promise((resolve, reject) => {
      const managementCall = JSON.parse(localStorage.getItem('JUSTTO_MANAGEMENT_CALL'))

      if (managementCall === null || managementCall?.appInstance === getAppInstance) {
        commit('setAtiveAppToCall', active)
        if (!active) { commit('clearActiveRequestInterval') }
        resolve()
      } else {
        reject(new Error('Aba inapta para chamadas.'))
      }
    })
  },

  addCall({ commit, dispatch, getters: { isActiveToCall, getAppInstance } }, callRequester) {
    console.log('addCall', isActiveToCall, callRequester.appInstance === getAppInstance)
    if (callRequester.appInstance === getAppInstance) {
      if (!isActiveToCall) {
        commit('setAtiveAppToCall', true)
      }

      const call = new Call({
        ...callRequester,
        status: CALL_STATUS.ENQUEUED,
        enqueuedDate: new Date().toISOString()
      })

      commit('addCallInQueue', call)
      dispatch('startDialerRequester')
    }
  },

  setAppInstance({ commit }, appInstance) {
    commit('setAppInstance', appInstance)
  },

  startManagementCall({ commit, dispatch, getters: { getAppInstance } }) {
    const { appInstance, currentCall } = JSON.parse(localStorage.getItem('JUSTTO_MANAGEMENT_CALL') || DEFAULT_JUSTTO_MANAGEMENT_CALL)

    if (appInstance === getAppInstance) {
      // TODO SAAS-4523: Fazer oq tem pra fazer
    } else {
      if (currentCall !== null && [CALL_STATUS.WAITING_DIALER_DETAIL, CALL_STATUS.WAITING_NEW_CALL, CALL_STATUS.ACTIVE_CALL].includes(currentCall?.status)) {
        const vue = document.getElementById('app').__vue__

        vue.$socket.emit('REQUEST_CALL_STATUS', { appInstance })

        commit('setBroadcastRequestCallStatus', () => {
          vue.$socket.emit('SOCKET_KILL_ACTIVE_CALL', { callId: currentCall.id })
        })
        // TODO SAAS-4523: Realizar um broadcast perguntando se a ligação ainda está ativa.
      }
    }
  },

  startDialerRequester({ commit }) {
    commit('setRequestProvideNewInterval')
  },

  endCall({ _ }, { dialerId, callId }) {
    return axiosDispatch({
      url: `api/dialer/${dialerId}/call/${callId}`,
      method: 'DELETE',
      mutation: 'endCall'
    }).catch(() => {
      // Chamada Encerrada.
    })
  },

  sendCallHeartbeat({ _ }, { dialerId, callId }) {
    return axiosDispatch({
      url: `api/dialer/${dialerId}/call/${callId}`,
      method: 'POST'
    })
  },

  requestDialerCall({ commit }, { number, dialerId }) {
    commit('setCurrentCallStatus', CALL_STATUS.WAITING_DIALER_DETAIL)

    return axiosDispatch({
      url: `api/disputes/${dialerId}/call`,
      method: 'POST',
      data: { number },
      mutation: 'setCallDetail'
      // TODO: Chamar mutation de Ocorrência.
    })
  },

  getDialerDetails({ _ }, { dialerId }) {
    return axiosDispatch({
      url: `api/dialer/${dialerId}/detail`,
      mutation: 'setTimeoutDialerDetail'
    })
  },

  requestProvide({ getters: { isActiveToCall, hasCallInQueue, firstCallInQueue } }) {
    console.table({ isActiveToCall, hasCallInQueue, status: firstCallInQueue.status })
    return isActiveToCall && hasCallInQueue && [CALL_STATUS.WAITING_DIALER, CALL_STATUS.ENQUEUED].includes(firstCallInQueue.status) ? axiosDispatch({
      url: `${dialerApi}/request`,
      method: 'PATCH',
      data: {}
    }) : new Promise((resolve, reject) => reject(new Error('Sem chamada ativa')))
  },

  answerCurrentCall({ commit }) {
    commit('setCurrentCallStatus', CALL_STATUS.ACTIVE_CALL)
  },

  responseCallStatus({ _ }, { appInstance }) {
    const vue = document.getElementById('app').__vue__

    vue.$socket.emit('RESPONSE_CALL_STATUS', { appInstance })
  },

  SOCKET_KILL_ACTIVE_CALL({ dispatch, getters: { getDialer } }, callId) {
    // TODO SAAS-4522: Rever validações
    dispatch('endCall', {
      dialerId: getDialer.id,
      callId
    })
  },

  SOCKET_ADD_DIALER_DETAIL({ getters: { isActiveToCall }, commit }, dialer) {
    if (isActiveToCall) {
      commit('addDialerDetail', dialer)
      commit('clearTimeoutDialerDetail')
    }
  },

  SOCKET_AVAILABLE_DIALER({ commit, dispatch, getters: { isActiveToCall } }, { dialerId }) {
    if (isActiveToCall) {
      commit('clearActiveRequestInterval')
      dispatch('getDialerDetails', { dialerId })
    }
  },

  SOCKET_REQUEST_CALL_STATUS({ getters: { getAppInstance }, dispatch }, { appInstance }) {
    if (getAppInstance === appInstance) {
      dispatch('responseCallStatus', { appInstance })
    }
  }
}
