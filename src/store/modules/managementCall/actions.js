// https://justto.atlassian.net/browse/SAAS-4522
import { Call } from '@/models/managementCall/currentCall'
import { ScheduledCallModel } from '@/models/managementCall/scheduledCallInfo'
import { axiosDispatch, buildQuery } from '@/utils'
import { CALL_STATUS } from '@/constants/callStatus'
import { publishWebsocket } from '@/utils/utils/others'

import JsSIP from 'jssip'
import moment from 'moment'
import getStats from 'getstats'

const vue = () => document.getElementById('app')?.__vue__
const DEFAULT_JUSTTO_MANAGEMENT_CALL = "{'currentCall':null,'callQueue':[],'appInstance':null}"
const dialerApi = 'api/dialer'
const disputeApi = 'api/disputes/v2'
const legacyDisputeApi = 'api/disputes'
const transcricaoApi = 'api/transcricao-audio/v1'

export default {
  activeAppToCall({ commit, getters: { hasOtherTabActive, isActiveToCall } }, active = false) {
    if (isActiveToCall || !hasOtherTabActive) {
      commit('setActiveAppToCall', active)
    }
  },

  addCall({ commit, dispatch, getters: { isActiveToCall, getGlobalAuthenticationObject, hasOtherTabActive } }, callRequester) {
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
      return Promise.resolve()
    } else if (hasOtherTabActive && !callRequester.published) {
      const channel = `/topic/account/${getGlobalAuthenticationObject?.accountId}`
      callRequester.published = true
      publishWebsocket(channel, 'ADD_CALL', callRequester, getGlobalAuthenticationObject)
      return Promise.reject(new Error('Discador ativo em outra aba.'))
    }
  },

  setAppInstance({ commit, dispatch }, appInstance) {
    commit('setAppInstance', appInstance)
    dispatch('setScheduledCallsRequester')
    dispatch('setAutomaticScheduledCallMaker')
  },

  SOCKET_NEW_SCHEDULED_CALL({ dispatch }) {
    dispatch('updateScheduledCallsRequester', 5)
  },

  setAutomaticScheduledCallMaker({ commit, dispatch }) {
    commit('setAutomaticScheduledCallMaker', () => dispatch('makeScheduledCall'))
  },

  makeScheduledCall({ dispatch, getters: { getScheduledCallsQueue, getAppInstance, hasScheduledCallInQueuedtoCall } }, callIndex = 0) {
    console.table({ getScheduledCallsQueue, getAppInstance, hasScheduledCallInQueuedtoCall })

    if (getScheduledCallsQueue.length > callIndex && !hasScheduledCallInQueuedtoCall) {
      const scheduledCall = getScheduledCallsQueue[callIndex]

      if (moment().isAfter(moment(scheduledCall.scheduledDate))) {
        dispatch('getPhoneCallInfo', scheduledCall.disputeMessageId).then(call => {
          const callModel = new ScheduledCallModel({
            ...call,
            phoneNumber: scheduledCall?.phoneNumber,
            appInstance: getAppInstance,
            scheduling: scheduledCall
          })

          return dispatch('addCall', callModel)
        })
      }
    } else {
      return Promise.resolve(false)
    }
  },

  updateScheduledCallsRequester({ commit, dispatch }, time) {
    commit('updateScheduledCallsRequester', {
      time,
      request: () => dispatch('getPhoneCalls')
    })
  },

  setScheduledCallsRequester({ commit, dispatch }) {
    commit('setScheduledCallsRequester', () => dispatch('getPhoneCalls'))
    dispatch('setAutomaticScheduledCallMaker')

    return Promise.resolve()
  },

  getPhoneCalls() {
    return axiosDispatch({
      url: `${legacyDisputeApi}/phone-calls`,
      mutation: 'setScheduledCallsState'
    })
  },

  getPhoneCallInfo(_, disputeMessageId) {
    return axiosDispatch({
      url: `${legacyDisputeApi}/phone-calls/${disputeMessageId}`
    })
  },

  updatePhoneCallStatus(_, communicationMessageId) {
    return axiosDispatch({
      url: `${legacyDisputeApi}/phone-calls/${communicationMessageId}/done`,
      method: 'PATCH',
      action: 'setScheduledCallsRequester'
    })
  },

  unschedulePhoneCallStatus(_, communicationMessageId) {
    return axiosDispatch({
      url: `${legacyDisputeApi}/phone-calls/${communicationMessageId}/canceled`,
      method: 'PATCH',
      action: 'getPhoneCalls'
    })
  },

  startManagementCall({ commit, getters: { getAppInstance } }) {
    const { appInstance, currentCall } = JSON.parse(localStorage.getItem('JUSTTO_MANAGEMENT_CALL') || DEFAULT_JUSTTO_MANAGEMENT_CALL)

    if (appInstance !== getAppInstance) {
      if (currentCall !== null && [CALL_STATUS.WAITING_DIALER_DETAIL, CALL_STATUS.WAITING_NEW_CALL, CALL_STATUS.ACTIVE_CALL].includes(currentCall?.status)) {
        const vue = document.getElementById('app').__vue__

        vue.$socket.emit('REQUEST_CALL_STATUS', { appInstance })

        commit('setBroadcastRequestCallStatus', () => {
          vue.$socket.emit('SOCKET_KILL_ACTIVE_CALL', { callId: currentCall.id })
        })
      }
    }
  },

  startDialerRequester({ commit }) {
    commit('setRequestProvideNewInterval')
  },

  leaveDialer({ state, commit, dispatch, getters: { getGlobalAuthenticationObject } }, { dialerId, callId }) {
    return axiosDispatch({
      url: `api/dialer/${dialerId}/call`,
      method: 'DELETE',
      mutation: 'endCall',
      payload: {
        id: callId,
        globalAuthenticationObject: getGlobalAuthenticationObject
      }
    }).finally(() => {
      if (state?.sipConnection?.session) {
        state.sipConnection.session.terminate()
      }

      dispatch('callTerminated')
      commit('clearCallHeartbeatInterval')
      commit('clearSipStack')
    })
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
      vue().$jusNotification({ error })
      dispatch('endCall', { dialerId, callId })
    })
  },

  requestDialerCall({ commit, dispatch, getters: { getGlobalAuthenticationObject, getCurrentCall } }, requestCallCommand) {
    if (getCurrentCall?.status !== CALL_STATUS.COMPLETED_CALL) {
      commit('setCurrentCallStatus', CALL_STATUS.WAITING_NEW_CALL)

      return axiosDispatch({
        url: `api/disputes/${requestCallCommand.disputeId}/dialer/${requestCallCommand.dialerId}/call`,
        method: 'POST',
        data: requestCallCommand,
        mutation: 'setCallDetail',
        payload: { globalAuthenticationObject: getGlobalAuthenticationObject }
      }).catch(() => {
        commit('addDialerDetail', null)
        commit('setCurrentCallStatus', CALL_STATUS.WAITING_DIALER)
        commit('clearSipStack')
        dispatch('startDialerRequester')
      })
    }
  },

  getDialerDetails(_, { dialerId }) {
    return axiosDispatch({
      url: `api/dialer/${dialerId}/detail`,
      mutation: 'setTimeoutDialerDetail'
    })
  },

  requestProvide({ commit, getters: { isActiveToCall, hasCallInQueue, firstCallInQueue, workspaceProperties } }) {
    return isActiveToCall && hasCallInQueue && [CALL_STATUS.WAITING_DIALER, CALL_STATUS.ENQUEUED].includes(firstCallInQueue.status) ? axiosDispatch({
      url: `${dialerApi}/request`,
      method: 'PATCH',
      data: {
        owner: workspaceProperties?.WORKSPACE_DIALER_OWNER || 'JUSTTO' // isJusttoAdmin ? 'DEV' : 'JUSTTO'
      }
    }) : new Promise((resolve) => {
      commit('clearActiveRequestInterval')
      commit('clearTimeoutDialerDetail')
      resolve()
    })
  },

  answerCurrentCall({ state, commit, getters: { hasSipSession, getDialer, getCurrentCall: { id: callId } } }, acceptedCall) {
    if (!getDialer?.id) return Promise.resolve(false)

    return new Promise((resolve) => {
      if (state.currentCall && hasSipSession) {
        if (acceptedCall) {
          state.sipConnection.session.answer({
            mediaConstraints: {
              audio: true, // only audio calls
              video: false
            }
          })
        } else {
          state.sipConnection.session.terminate()
        }

        commit('answerCurrentCall', { acceptedCall, dialerId: getDialer.id, callId })

        resolve(acceptedCall)
      } else {
        resolve(false)
        commit('answerCurrentCall', { acceptedCall: false, dialerId: getDialer.id, callId })
      }
    })
  },

  responseCallStatus(_, { appInstance }) {
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

  setValidNumberInCall(_, { interactionId, disputeId }) {
    return interactionId ? axiosDispatch({
      url: `${disputeApi}/${disputeId}/interaction/${interactionId}/last-inbound`,
      method: 'PATCH'
    }) : Promise.resolve()
  },

  SOCKET_KILL_ACTIVE_CALL({ dispatch, getters: { getDialer } }, callId) {
    dispatch('endCall', {
      dialerId: getDialer.id,
      callId
    })
  },

  callTerminated({ commit, dispatch, getters: { getCurrentCall, getDialer, getGlobalAuthenticationObject: globalAuthenticationObject } }) {
    const scheduling = getCurrentCall?.scheduling
    const callId = getCurrentCall?.id
    const dialerId = getDialer?.id

    if (scheduling) {
      dispatch('updatePhoneCallStatus', getCurrentCall?.scheduling?.disputeMessageId)
    }

    commit('clearCallHeartbeatInterval')
    commit('clearSipStack')

    if (Number.isInteger(callId)) {
      dispatch('endCall', {
        dialerId,
        callId
      })
    }
  },

  SOCKET_ADD_DIALER_DETAIL({ dispatch, getters: { isActiveToCall, getCurrentCall, isToIgnoreDialer, getDialer }, commit }, dialer) {
    const acceptDialer = isActiveToCall && !isToIgnoreDialer && getCurrentCall && !(getDialer?.name)

    if (acceptDialer) {
      commit('addDialerDetail', dialer)
      commit('setCurrentCallStatus', CALL_STATUS.WAITING_NEW_CALL)
      commit('clearTimeoutDialerDetail')
      commit('clearActiveRequestInterval')

      // document.getElementById('remoteAudio')
      const remoteAudio = document.getElementById('globalAudio')
      const socket = new JsSIP.WebSocketInterface(dialer.sipServer.websocketHost)

      const configuration = {
        sockets: [socket],
        uri: dialer.sipServer.url,
        password: dialer.sipServer.password
      }

      const phone = new JsSIP.UA(configuration)

      commit('setSipStack', phone)

      phone.on('connected', function() {
        const requestDialerCommand = {
          phoneNumber: getCurrentCall.number,
          dialerId: dialer.id,
          disputeId: getCurrentCall.disputeId,
          contactRoleId: getCurrentCall.toRoleId,
          apiKey: dialer?.sipServer?.apiKey
        }

        dispatch('requestDialerCall', requestDialerCommand)
      })

      if (process.env.NODE_ENV === 'development') {
        phone.on('disconnected', function(e) {
          // Quando finaliza a sessão do SIP.
          console.log('disconnected', e)
        })

        phone.on('registered', function(e) {
          console.log('registered', e)
        })

        phone.on('unregistered', function(e) {
          console.log('unregistered', e)
        })

        phone.on('registrationFailed', function(e) {
          console.log('registrationFailed', e)
        })
      }

      phone.on('newRTCSession', function(data) {
        const session = data.session

        commit('setSipSession', session)

        if (session.direction === 'incoming') {
          if (process.env.NODE_ENV === 'development') {
            session.on('accepted', function() {
              console.log('newRTCSession.accepted')
            })

            session.on('confirmed', function(e) {
              console.log('newRTCSession.confirmed', e, JsSIP.RTCSession)
            })
          }

          session.on('ended', function(e) {
            if (process.env.NODE_ENV === 'development') console.log('newRTCSession.ended', e)
            dispatch('callTerminated')
          })

          session.on('failed', function(e) {
            if (process.env.NODE_ENV === 'development') console.log('newRTCSession.failed', e)
            dispatch('callTerminated')
          })

          session.on('peerconnection', function(e) {
            if (process.env.NODE_ENV === 'development') console.log('newRTCSession.addstream', e)

            const peerconnection = e.peerconnection // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection
            const repeatInterval = 5000

            getStats(peerconnection, ({ bandwidth, audio, results, connectionType, encryption, internal, isOfferer }) => {
              commit('setSipConnectionSpeed', bandwidth.speed)

              vue().$jusSegment('CALL_TRACK', {
                track: {
                  bandwidth,
                  audio,
                  results,
                  connectionType,
                  encryption,
                  isOfferer
                },
                call: getCurrentCall,
                dialer: dialer
              })
            }, repeatInterval)

            peerconnection.ontrack = function(event) {
              remoteAudio.srcObject = event.streams[0]
              remoteAudio.muted = false
              remoteAudio.play()
            }

            peerconnection.onremovestream = function(e2) {
              remoteAudio.src = null
              remoteAudio.pause()
            }
          })

          commit('setCurrentCallStatus', CALL_STATUS.RECEIVING_CALL)
        }
      })

      new Promise(function(resolve, reject) {
        try {
          phone.stop()
          phone.start()

          resolve()
        } catch (e) {
          reject(e)
        }
      }).then(() => {
        commit('setCurrentCallStatus', CALL_STATUS.WAITING_NEW_CALL)
        commit('clearActiveRequestInterval')
      })
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
      commit('addDialerDetail', { id: dialerId })
      commit('clearActiveRequestInterval')
      commit('setCurrentCallStatus', CALL_STATUS.WAITING_DIALER_DETAIL)
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
  },

  updateCallStatus(_, disputeMessageId) {
    return axiosDispatch({
      method: 'PATCH',
      url: `${legacyDisputeApi}/phone-calls/${disputeMessageId}`
    })
  },

  getCallStatus(_, callId) {
    return axiosDispatch({
      url: `${dialerApi}/call/${callId}`
    })
  },

  getCallMedia({ getters: { workspaceSubdomain: subdomain } }, { disputeId, url }) {
    return axiosDispatch({
      url: `${transcricaoApi}/media${buildQuery({
        disputeId,
        url,
        subdomain
      })}`
    })
  },

  getCallGenerateMedia({ getters: { workspaceSubdomain: subdomain } }, { disputeId, url }) {
    return axiosDispatch({
      method: 'POST',
      url: `${transcricaoApi}/media/processar`,
      data: {
        disputeId,
        url,
        subdomain,
        tentativas: 1
      }
    })
  }
}
