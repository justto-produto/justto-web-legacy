// https://justto.atlassian.net/browse/SAAS-4522
import { Call } from '@/models/managementCall/currentCall'
import { axiosDispatch } from '@/utils'
import { publishWebsocket } from '@/utils/utils/others'
import SIPml from 'ecmascript-webrtc-sipml'
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
    } else if (hasOtherTabActive && !callRequester.published) {
      const channel = `/topic/account/${getGlobalAuthenticationObject?.accountId}`
      callRequester.published = true
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
      payload: {
        id: Number(callId),
        globalAuthenticationObject: getters.getGlobalAuthenticationObject
      }
    }).catch(() => {
      // Chamada Encerrada.
    }).finally(() => {
      commit('clearCallHeartbeatInterval')
    })
  },

  // TODO: Verificar se isso vai servir pra alguma coisa
  // sendCallHeartbeat({ _ }, { dialerId, callId }) {
  //   return axiosDispatch({
  //     url: `api/dialer/${dialerId}/call/${callId}`,
  //     method: 'POST'
  //   })
  // },

  sendHeartBeat({ getters: { getDialer: { id: dialerId }, getCurrentCall: { id: callId } } }) {
    return axiosDispatch({
      url: `api/dialer/${dialerId}/call/${callId}/heartbeat`,
      method: 'PATCH'
    })
  },

  requestDialerCall({ commit, getters }, requestCallCommand) {
    commit('setCurrentCallStatus', CALL_STATUS.WAITING_NEW_CALL)

    return axiosDispatch({
      url: `api/disputes/${requestCallCommand.disputeId}/dialer/${requestCallCommand.dialerId}/call`,
      method: 'POST',
      data: requestCallCommand,
      mutation: 'setCallDetail',
      payload: { globalAuthenticationObject: getters.getGlobalAuthenticationObject }
    })
  },

  getDialerDetails({ _ }, { dialerId }) {
    return axiosDispatch({
      url: `api/dialer/${dialerId}/detail`,
      mutation: 'setTimeoutDialerDetail'
    })
  },

  requestProvide({ getters: { isActiveToCall, hasCallInQueue, firstCallInQueue } }) {
    return isActiveToCall && hasCallInQueue && [CALL_STATUS.WAITING_DIALER, CALL_STATUS.ENQUEUED].includes(firstCallInQueue.status) ? axiosDispatch({
      url: `${dialerApi}/request`,
      method: 'PATCH',
      data: {}
    }) : new Promise((resolve, reject) => reject(new Error('Sem chamada esperando')))
  },

  answerCurrentCall({ commit, dispatch, getters: { getDialer: { id: dialerId }, getCurrentCall: { id: callId }, getGlobalAuthenticationObject: globalAuthenticationObject } }, acceptedCall) {
    commit('answerCurrentCall', { acceptedCall, globalAuthenticationObject })

    if (!acceptedCall) {
      commit('clearCallHeartbeatInterval')
      dispatch('endCall', { dialerId, callId })
    }
  },

  responseCallStatus({ _ }, { appInstance }) {
    const vue = document.getElementById('app').__vue__
    // TODO usar publishWebsocket
    vue.$socket.emit('RESPONSE_CALL_STATUS', { appInstance })
  },

  SOCKET_KILL_ACTIVE_CALL({ dispatch, getters: { getDialer } }, callId) {
    // TODO SAAS-4522: Rever validações
    dispatch('endCall', {
      dialerId: getDialer.id,
      callId
    })
  },

  SOCKET_ADD_DIALER_DETAIL({ dispatch, getters: { isActiveToCall, getCurrentCall }, commit }, dialer) {
    if (isActiveToCall) {
      commit('setCurrentCallStatus', CALL_STATUS.WAITING_NEW_CALL)
      commit('addDialerDetail', dialer)
      commit('clearTimeoutDialerDetail')
      commit('clearActiveRequestInterval')

      SIPml.setDebugLevel((window.localStorage && window.localStorage.getItem('org.doubango.expert.disable_debug') === 'Justto') ? 'error' : 'info')
      const sipListener = (e) => {
        switch (e.type) {
          case 'started': {
            const registerSession = sipStack.newSession('register', {
              events_listener: {
                events: '*',
                listener: sipListener
              }
            })
            registerSession.register()
            commit('setSipSession', registerSession)
            break
          }
          case 'i_new_call':
            commit('setCurrentCallStatus', CALL_STATUS.RECEIVING_CALL)
            commit('setSipSession', e.newSession)
            break
          case 'terminated':
            dispatch('endCall', { dialerId: dialer.id, callId: getCurrentCall.id })
            break
          default:
            if (process.env.NODE_ENV === 'development') {
              console.log(e)
            }
            break
        }
      }
      let sipStack = null
      // faltando add no back
      SIPml.init(_ => {
        sipStack = new SIPml.Stack({
          realm: dialer.sipServer.signalingHost,
          impi: dialer.sipServer.username,
          impu: dialer.sipServer.url,
          password: dialer.sipServer.password,
          display_name: 'Justto',
          websocket_proxy_url: dialer.sipServer.websocketHost,
          events_listener: {
            events: '*',
            listener: sipListener
          }
        })

        sipStack.start()
        commit('setSipStack', sipStack)
      })

      const requestDialerCommand = {
        phoneNumber: getCurrentCall.number,
        dialerId: dialer.id,
        disputeId: getCurrentCall.disputeId,
        contactRoleId: getCurrentCall.toRoleId,
        apiKey: dialer?.sipServer?.apiKey
      }

      dispatch('requestDialerCall', requestDialerCommand)
      commit('clearActiveRequestInterval')
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
  },

  SOCKET_REMOVE_CALL({ commit, getters: { isActiveToCall, getGlobalAuthenticationObject } }, removeCommand) {
    if (isActiveToCall) {
      commit('removeCallById', { callId: removeCommand.callId, globalAuthenticationObject: getGlobalAuthenticationObject })
    } else if (!removeCommand.published) {
      removeCommand.published = true
      const channel = `/topic/account/${getGlobalAuthenticationObject?.accountId}`
      publishWebsocket(channel, 'REMOVE_CALL', removeCommand, getGlobalAuthenticationObject)
    }
  }
}
