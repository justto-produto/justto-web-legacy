// https://justto.atlassian.net/browse/SAAS-4522
import { Call } from '@/models/managementCall/currentCall'
import { axiosDispatch } from '@/utils'
import { publishWebsocket } from '@/utils/utils/others'

import { CALL_STATUS } from '@/constants/callStatus'

const DEFAULT_JUSTTO_MANAGEMENT_CALL = '{"currentCall":null,"callQueue":[],"appInstance":null}'
const dialerApi = 'api/dialer'

export default {
  activeAppToCall({ commit, getters: { hasOtherTabActive, isActiveToCall } }, active = false) {
    if (isActiveToCall || !hasOtherTabActive) {
      commit('setActiveAppToCall', active)
    }
  },

  addCall({ commit, dispatch, getters: { isActiveToCall, getAppInstance, getGlobalAuthenticationObject, hasOtherTabActive } }, callRequester) {
    console.log('addCall', isActiveToCall, callRequester.appInstance === getAppInstance)
    if (isActiveToCall || !hasOtherTabActive) {
      if (!hasOtherTabActive) {
        commit('setActiveAppToCall', true)
      }
      const call = new Call({
        ...callRequester,
        status: CALL_STATUS.ENQUEUED,
        enqueuedDate: new Date().toISOString()
      })

      commit('addCallInQueue', { call, globalAuthenticationObject: getGlobalAuthenticationObject })
      dispatch('startDialerRequester')
    } else if (hasOtherTabActive) {
      const channel = `/topic/account/${getGlobalAuthenticationObject?.accountId}`
      publishWebsocket(channel, 'ADD_CALL', callRequester, getGlobalAuthenticationObject)
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

  endCall({ commit, getters }, { dialerId, callId }) {
    return axiosDispatch({
      url: `api/dialer/${dialerId}/call/${callId}`,
      method: 'DELETE',
      mutation: 'endCall',
      payload: { globalAuthenticationObject: getters.getGlobalAuthenticationObject }
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

  requestDialerCall({ commit, getters }, { number, dialerId }) {
    commit('setCurrentCallStatus', CALL_STATUS.WAITING_DIALER_DETAIL)

    return axiosDispatch({
      url: `api/disputes/${dialerId}/call`,
      method: 'POST',
      data: { number },
      mutation: 'setCallDetail',
      payload: { globalAuthenticationObject: getters.getGlobalAuthenticationObject }
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

  SOCKET_ADD_CALL({ getters: { isActiveToCall }, dispatch }, callRequester) {
    if (isActiveToCall) {
      dispatch('addCall', callRequester)
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
