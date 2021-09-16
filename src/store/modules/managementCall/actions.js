// https://justto.atlassian.net/browse/SAAS-4522
import { Call } from '@/models/managementCall/currentCall'
import { axiosDispatch } from '@/utils'

import { CALL_STATUS } from '@/constants/callStatus'

const DEFAULT_JUSTTO_MANAGEMENT_CALL = '{"currentCall":null,"callQueue":[],"appInstance":null}'

export default {
  addCall({ commit }, callRequester) {
    if (callRequester.activeToCall) {
      const call = new Call({
        ...callRequester,
        status: CALL_STATUS.ENQUEUED,
        enqueuedDate: new Date().toISOString()
      })

      commit('addCallInQueue', call)
    } else {
      // publicar o parâmetro callRequester no websocket com a operação ADD_CALL para que a aplicação que esteja gerenciando a fila adicione na fila;
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

  getDialerDetails({ _ }, { id }) {
    return axiosDispatch({
      url: `api/dialer/${id}/detail`,
      mutation: 'setTimeoutDialerDetail'
    })
  },

  requestProvide({ getters: { isActiveToCall, hasCallInQueue, firstCallInQueue } }) {
    // TODO: Rever descrição

    return isActiveToCall && hasCallInQueue && [CALL_STATUS.WAITING_DIALER, CALL_STATUS.ENQUEUED].includes(firstCallInQueue.status) ? axiosDispatch({
      // url: 'api/dialer/provide-new',
      url: 'api/dialer/request'
      // mutation: 'setRequestProvide'
    }) : new Promise((resolve, reject) => reject(new Error('Nenhuma ligação esperando na fila')))
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

  SOCKET_ADD_DIALER_DETAIL({ commit }, dialer) {
    commit('addDialerDetail', dialer)
    commit('clearTimeoutDialerDetail')
  },

  SOCKET_AVAILABLE_DIALER({ commit, dispatch }, { id }) {
    commit('clearActiveRequestInterval')
    dispatch('getDialerDetails', { id })
  },

  SOCKET_REQUEST_CALL_STATUS({ getters: { getAppInstance }, dispatch }, { appInstance }) {
    if (getAppInstance === appInstance) {
      dispatch('responseCallStatus', { appInstance })
    }
  }
}
