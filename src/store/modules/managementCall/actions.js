// https://justto.atlassian.net/browse/SAAS-4522
import { Call } from '@/models/managementCall/currentCall'
import { axiosDispatch } from '@/utils'
import { publishWebsocket } from '@/utils/utils/others'
import SIPml from 'ecmascript-webrtc-sipml'
import { CALL_STATUS } from '@/constants/callStatus'

const DEFAULT_JUSTTO_MANAGEMENT_CALL = '{"currentCall":null,"callQueue":[],"appInstance":null}'
const dialerApi = 'api/dialer'
const disputeApi = 'api/disputes/v2'

export default {
  activeAppToCall({ commit, getters: { hasOtherTabActive, isActiveToCall } }, active = false) {
    if (isActiveToCall || !hasOtherTabActive) {
      commit('setActiveAppToCall', active)
    }
  },

  addCall({ commit, dispatch, getters: { isActiveToCall, getAppInstance, getGlobalAuthenticationObject, hasOtherTabActive } }, callRequester) {
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
    }).finally(() => {
      commit('clearCallHeartbeatInterval')
      commit('clearSipStack')
    })
  },

  sendHeartBeat({ dispatch, getters: { getDialer: { id: dialerId }, getCurrentCall: { id: callId } } }) {
    return axiosDispatch({
      url: `api/dialer/${dialerId}/call/${callId}/heartbeat`,
      method: 'PATCH'
    }).catch(error => {
      this.$jusNotification({ error })
      dispatch('endCall', { dialerId, callId })
    })
  },

  requestDialerCall({ commit, getters, dispatch }, requestCallCommand) {
    commit('setCurrentCallStatus', CALL_STATUS.WAITING_NEW_CALL)

    return axiosDispatch({
      url: `api/disputes/${requestCallCommand.disputeId}/dialer/${requestCallCommand.dialerId}/call`,
      method: 'POST',
      data: requestCallCommand,
      mutation: 'setCallDetail',
      payload: { globalAuthenticationObject: getters.getGlobalAuthenticationObject }
    }).catch(() => {
      commit('addDialerDetail', null)
      commit('setCurrentCallStatus', CALL_STATUS.WAITING_DIALER)
      commit('clearSipStack')
      dispatch('startDialerRequester')
    })
  },

  getDialerDetails({ _ }, { dialerId }) {
    return axiosDispatch({
      url: `api/dialer/${dialerId}/detail`,
      mutation: 'setTimeoutDialerDetail'
    })
  },

  requestProvide({ commit, getters: { isActiveToCall, hasCallInQueue, firstCallInQueue, isJusttoAdmin } }) {
    return isActiveToCall && hasCallInQueue && [CALL_STATUS.WAITING_DIALER, CALL_STATUS.ENQUEUED].includes(firstCallInQueue.status) ? axiosDispatch({
      url: `${dialerApi}/request`,
      method: 'PATCH',
      data: {
        owner: isJusttoAdmin ? 'DEV' : 'JUSTTO'
      }
    }) : new Promise((resolve, reject) => {
      commit('clearActiveRequestInterval')
      commit('clearTimeoutDialerDetail')
      resolve()
    })
  },

  answerCurrentCall({ state, commit, dispatch, getters: { hasSipSession, getDialer: { id: dialerId }, getCurrentCall: { id: callId } } }, acceptedCall) {
    return new Promise((resolve) => {
      if (state.currentCall && hasSipSession && acceptedCall) {
        const audioElement = document.getElementById('remoteAudio')
        const successfulJoiningCall = state.sipConnection.session.accept({
          audio_remote: audioElement,
          events_listener: {
            events: '*',
            listener: (e) => {
              switch (e.type) {
                case 'terminated':
                  dispatch('callTerminated')
                  break
                default:
                  if (process.env.NODE_ENV === 'development') {
                    console.table(e)
                  }
              }
            }
          }
        })

        commit('answerCurrentCall', {
          acceptedCall: !successfulJoiningCall,
          dialerId,
          callId
        })

        resolve(successfulJoiningCall === 0)
      } else {
        resolve(false)
        commit('answerCurrentCall', { acceptedCall: false, dialerId, callId })
      }
    })
  },

  responseCallStatus({ _ }, { appInstance }) {
    const vue = document.getElementById('app').__vue__
    // TODO usar publishWebsocket
    vue.$socket.emit('RESPONSE_CALL_STATUS', { appInstance })
  },

  setInvalidNumberInCall({ getters: { getCurrentCall: { disputeId, interactionId } } }, { reason }) {
    return axiosDispatch({
      url: `${disputeApi}/${disputeId}/interaction/${interactionId}/invalid-contact/${reason}`,
      method: 'PATCH'
    })
  },

  SOCKET_KILL_ACTIVE_CALL({ dispatch, getters: { getDialer } }, callId) {
    // TODO SAAS-4522: Rever validações
    dispatch('endCall', {
      dialerId: getDialer.id,
      callId
    })
  },

  callTerminated({ commit, getters: { getCurrentCall: { id }, getGlobalAuthenticationObject: globalAuthenticationObject } }) {
    commit('clearCallHeartbeatInterval')
    commit('clearSipStack')
    commit('endCall', {
      payload: {
        id, globalAuthenticationObject
      }
    })
  },

  SOCKET_ADD_DIALER_DETAIL({ dispatch, getters: { isActiveToCall, getCurrentCall, isToIgnoreDialer, getDialer }, commit }, dialer) {
    if (isActiveToCall && !isToIgnoreDialer && getCurrentCall && !getDialer) {
      commit('setCurrentCallStatus', CALL_STATUS.WAITING_NEW_CALL)
      commit('addDialerDetail', dialer)
      commit('clearTimeoutDialerDetail')
      commit('clearActiveRequestInterval')

      SIPml.setDebugLevel((window.localStorage && window.localStorage.getItem('org.doubango.expert.disable_debug') === 'Justto') ? 'error' : 'info')

      const setSipStack = () => {
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
      }

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

          case 'i_new_call': {
            commit('setCurrentCallStatus', CALL_STATUS.RECEIVING_CALL)
            commit('setSipSession', e.newSession)
            break
          }

          default:
            if (process.env.NODE_ENV === 'development') {
              console.table(e)
            }
            break
        }
      }

      let sipStack = null
      // faltando add no back

      if (!SIPml.isInitialized()) {
        SIPml.init(setSipStack)
      } else {
        setSipStack()
      }

      const requestDialerCommand = {
        phoneNumber: getCurrentCall.number,
        dialerId: dialer.id,
        disputeId: getCurrentCall.disputeId,
        contactRoleId: getCurrentCall.toRoleId,
        apiKey: dialer?.sipServer?.apiKey
      }

      dispatch('requestDialerCall', requestDialerCommand)
      commit('clearActiveRequestInterval')
    } else if (isToIgnoreDialer) {
      commit('setIgnoreDialer', false)
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
