import { CALL_STATUS } from '@/constants/callStatus'
import { publishWebsocket } from '@/utils/utils/others'
import Vue from 'vue'

function updateManagementCall({ appInstance, currentCall, callQueue, activeToCall }, globalAuthenticationObject) {
  if (activeToCall && globalAuthenticationObject) {
    const newSharedInstance = { appInstance, currentCall, callQueue }

    localStorage.setItem('JUSTTO_MANAGEMENT_CALL', JSON.stringify(newSharedInstance))
    const channel = `/topic/account/${globalAuthenticationObject?.accountId}`
    publishWebsocket(channel, 'REFRESH_MANAGEMENT_CALL', { appInstance }, globalAuthenticationObject)
  }
}

export default {
  setActiveAppToCall(state, active) {
    Vue.set(state, 'activeToCall', active)
  },

  setCurrentCallStatus(state, status) {
    if (state.currentCall) {
      Vue.set(state.currentCall, 'status', CALL_STATUS[status])
    }
  },

  endCall(state, { payload: { id, globalAuthenticationObject } }) {
    if (state.currentCall && state.currentCall.id === id) {
      Vue.set(state.currentCall, 'status', CALL_STATUS.COMPLETED_CALL)
    }

    const remainingCalls = state.callQueue.filter(call => (call.id !== id || call.number !== state.currentCall.number))

    Vue.set(state, 'callQueue', remainingCalls)
    Vue.set(state, 'dialer', null)
    Vue.set(state, 'currentCall', (state.callQueue[0] || null))

    this.commit('clearCallHeartbeatInterval')

    updateManagementCall(state, globalAuthenticationObject)
  },

  addCallInQueue(state, { call, globalAuthenticationObject }) {
    function calcFirstAvailablePos(queue) {
      let pos = queue.length

      queue.filter((call, index) => {
        if (![
          CALL_STATUS.WAITING_NEW_CALL,
          CALL_STATUS.RECEIVING_CALL,
          CALL_STATUS.ACTIVE_CALL
        ].includes(call.status)) {
          pos = index
        }
      })

      return pos
    }

    const position = !call.priority ? state.callQueue.length : calcFirstAvailablePos(state.callQueue)

    if (call.priority) {
      const tempStatus = state.callQueue[position].status

      Vue.set(state.callQueue, 'position', CALL_STATUS.ENQUEUED)
      Vue.set(call, 'status', tempStatus)
    }

    if (position === 0) {
      Vue.set(state, 'currentCall', call)
    }

    state.callQueue.splice(position, 0, call)

    updateManagementCall(state, globalAuthenticationObject)
  },

  addDialerDetail(state, dialer) {
    Vue.set(state, 'dialer', dialer)
  },

  setRequestProvideNewInterval(state) {
    Vue.set(state, 'requestProvideNewInterval', setInterval(() => this.dispatch('requestProvide', {}), (5 * 1000)))
  },

  clearActiveRequestInterval(state) {
    clearInterval(state.requestProvideNewInterval)
    Vue.set(state, 'requestProvideNewInterval', null)
  },

  setTimeoutDialerDetail(state) {
    Vue.set(state, 'timeoutDialerDetail', setTimeout(() => {
      if (state.callQueue.length > 0) {
        Vue.set(state.callQueue[0], 'status', CALL_STATUS.WAITING_NEW_CALL)
      }
    }, 0))
  },

  clearTimeoutDialerDetail(state) {
    clearTimeout(state.timeoutDialerDetail)
    Vue.set(state, 'timeoutDialerDetail', null)
  },

  setReceivedCall(state) {
    Vue.set(state.currentCall, 'status', CALL_STATUS.RECEIVING_CALL)
  },

  setCallHeartbeatInterval(state) {
    const interval = ((state.dialer?.keepAlive?.timeout || 10) * 1000) / 2

    Vue.set(state, 'callHeartbeatInterval', setInterval(() => this.dispatch('sendHeartBeat'), interval))
  },

  clearCallHeartbeatInterval(state) {
    clearInterval(state.callHeartbeatInterval)
    Vue.set(state, 'callHeartbeatInterval', null)
  },

  setCallDetail(state, receivedCallDetails) {
    const occurrence = receivedCallDetails.data
    const callDetail = occurrence?.interaction?.properties
    const interactionId = occurrence?.interaction?.id
    const messageId = occurrence?.interaction?.message?.messageId

    if (callDetail && callDetail.VALUE) {
      const backCallId = Number(callDetail.VALUE)
      Vue.set(state.currentCall, 'detail', callDetail)
      Vue.set(state.currentCall, 'id', backCallId)
      Vue.set(state.currentCall, 'messageId', messageId)
      Vue.set(state.currentCall, 'interactionId', interactionId)

      this.commit('setCallHeartbeatInterval')
    }

    updateManagementCall(state, receivedCallDetails.globalAuthenticationObject)
  },

  setAppInstance(state, appInstance) {
    Vue.set(state, 'appInstance', appInstance)
  },

  setRequestProvide(state, { appInstance }) {
    Vue.set(state.currentCall, 'status', CALL_STATUS.WAITING_DIALER)
  },

  updateScheduledCallsRequester(state, { time, request }) {
    clearTimeout(state.scheduledCallTimeout)

    state.scheduledCallTimeout = setTimeout(request, time * 1000)
  },

  setScheduledCallsRequester(state, requester) {
    clearInterval(state.scheduledCallInterval)

    if (requester) {
      requester()
      // Vue.set(state, 'scheduledCallInterval', setInterval(requester, 25 * 60 * 1000))
    }
  },

  setBroadcastRequestCallStatus(state, callback) {
    Vue.set(state, 'broadcastRequestCallStatus', setTimeout(callback, 4 * 1000))
  },

  SOCKET_REFRESH_MANAGEMENT_CALL(state, publisherAppInstance) {
    if (publisherAppInstance !== state.appInstance) {
      const sharedManagementCall = JSON.parse(localStorage.getItem('JUSTTO_MANAGEMENT_CALL'))

      Vue.set(state, 'sharedManagementCall', sharedManagementCall)
    }
  },

  // TODO: Não foi implementadp no back
  SOCKET_KILL_MANAGEMENT_CALL(state) {
    Vue.set(state, 'activeToCall', false)
    // Vue.set(state, 'callQueue', []) TODO: Só remover o item comrespondente à chamada ativa.
  },

  SOCKET_RESPONSE_CALL_STATUS(state) {
    clearTimeout(state.broadcastRequestCallStatus)

    Vue.set(state, 'broadcastRequestCallStatus', null)
    Vue.set(state, 'activeToCall', false)
  },

  removeCallById(state, { callId, globalAuthenticationObject }) {
    if (state.currentCall?.id === callId) {
      this.commit('endCall', { payload: { id: callId, globalAuthenticationObject } })
      this.commit('clearActiveRequestInterval')
      this.commit('setIgnoreDialer', true)
    } else {
      Vue.set(state, 'callQueue', state.callQueue.filter(call => call.id !== callId))
      updateManagementCall(state, globalAuthenticationObject)
    }
  },

  setSipStack(state, stack) {
    Vue.set(state.sipConnection, 'stack', stack)
  },

  clearSipStack(state) {
    try {
      state.sipConnection.stack.stop()
    } catch (error) {}

    Vue.set(state, 'sipConnection', {
      stack: null,
      session: null
    })
  },

  setSipSession(state, session) {
    Vue.set(state.sipConnection, 'session', session)
  },

  setSipConnectionSpeed(state, speed) {
    Vue.set(state.sipConnection, 'speed', speed)
  },

  setIgnoreDialer(state, ignore) {
    Vue.set(state, 'ignoreDialer', Boolean(ignore))
  },

  answerCurrentCall(state, { acceptedCall, dialerId, callId }) {
    if (acceptedCall) {
      Vue.set(state.currentCall, 'status', CALL_STATUS.ACTIVE_CALL)
    } else {
      if (state.currentCall) { Vue.set(state.currentCall, 'status', CALL_STATUS.COMPLETED_CALL) }
      this.commit('clearCallHeartbeatInterval')
      this.dispatch('endCall', { dialerId, callId })
    }
  },

  setScheduledCallsState(state, calls) {
    Vue.set(state, 'scheduledCalls', calls)
  },

  resetScheduledCallsState(state) {
    Vue.set(state, 'scheduledCalls', [])
  },

  setAutomaticScheduledCallMaker(state, request) {
    clearInterval(state.automaticScheduledCallMaker)

    if (this.getters?.canMakeScheduledCalls) {
      const time = 1 * 60 * 1000 // 5 minutos

      Vue.set(state, 'automaticScheduledCallMaker', setInterval(request, time))
    }
  }
}
