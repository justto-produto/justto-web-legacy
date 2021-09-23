import { CALL_STATUS } from '@/constants/callStatus'
import Vue from 'vue'

function publishWebsocket(channel, event, object) {
  const vue = document.getElementById('app').__vue__
  const socketData = {
    event,
    channel,
    data: object
  }
  console.log('Sending object to websocket', socketData)
  vue.$socket.emit('send', socketData)
}

function updateManagementCall({ appInstance, currentCall, callQueue, activeToCall }, { getGlobalAuthenticationObject }) {
  if (activeToCall) {
    const newSharedInstance = { appInstance, currentCall, callQueue }
    console.log('updateManagementCall', newSharedInstance)

    localStorage.setItem('JUSTTO_MANAGEMENT_CALL', JSON.stringify(newSharedInstance))
    const channel = `/topic/account/${getGlobalAuthenticationObject?.accountId}`
    this.publishWebsocket(channel, 'REFRESH_MANAGEMENT_CALL', { appInstance })
  }
}

export default {
  setAtiveAppToCall(state, active) {
    console.log('setAtiveAppToCall', active)
    Vue.set(state, 'activeToCall', active)
  },

  setCurrentCallStatus(state, status) {
    if (state.currentCall && [CALL_STATUS.RECEIVING_CALL].includes(state.currentCall.status)) {
      Vue.set(state.currentCall, 'status', CALL_STATUS[status])
    }
  },

  endCall(state, { id }) {
    if (state.currentCall && state.currentCall.id === id) {
      Vue.set(state.currentCall, 'status', CALL_STATUS.COMPLETED_CALL)
    }

    Vue.set(state, 'callQueue', state.callQueue.filter(call => call.id === id))
    Vue.set(state, 'dialer', null)
    Vue.set(state, 'currentCall', null)

    updateManagementCall(state)
  },

  addCallInQueue(state, call) {
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

    updateManagementCall(state)
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
        Vue.set(state.callQueue[0], 'status', CALL_STATUS.ENQUEUED)
      }
    }))
  },

  clearTimeoutDialerDetail(state) {
    clearTimeout(state.timeoutDialerDetail)
    Vue.set(state, 'timeoutDialerDetail', null)
  },

  setReceivedCall(state) {
    Vue.set(state.currentCall, 'status', CALL_STATUS.RECEIVING_CALL)
  },

  setCallHeartbeatInterval(state) {
    Vue.set(state, 'callHeartbeatInterval', setInterval(() => this.dispatch('managementCall/startDialerRequester')), ((state.dialer?.keepAlive?.timeout || 10) * 1000) / 4)
  },

  clearCallHeartbeatInterval(state) {
    clearInterval(state.callHeartbeatInterval)
    Vue.set(state, 'callHeartbeatInterval', null)
  },

  setCallDetail(state, _interaction) {
    /**
     *  TODO: Validar dados da interaction para atualizar a currentCall
     *  id da call (interaction.properties.value)
     *  number
     *  disputeId
     *  Status para WAITING_NEW_CALL
     */

    Vue.set(state, 'currentCall', {
      ...state.currentCall,
      // id: ?,
      // number: ?,
      // disputeId: ?,
      status: CALL_STATUS.WAITING_NEW_CALL
    })

    updateManagementCall(state)
  },

  setAppInstance(state, appInstance) {
    Vue.set(state, 'appInstance', appInstance)
  },

  setRequestProvide(state, { appInstance }) {
    Vue.set(state.currentCall, 'status', CALL_STATUS.WAITING_DIALER)
    console.log('setRequestProvide', appInstance)
  },

  setBroadcastRequestCallStatus(state, callback) {
    Vue.set(state, 'broadcastRequestCallStatus', setTimeout(callback, 4 * 1000))
  },

  SOCKET_REFRESH_MANAGEMENT_CALL(state, publisherAppInstance) {
    console.log('Receiving RefreshManagementCall Notification', publisherAppInstance)
    if (publisherAppInstance !== state.appInstance) {
      const sharedManagementCall = JSON.parse(localStorage.getItem('JUSTTO_MANAGEMENT_CALL'))
      console.log('Received new SharedManagementCall', sharedManagementCall)

      Vue.set(state, 'sharedManagementCall', sharedManagementCall)
    }
  },

  SOCKET_KILL_MANAGEMENT_CALL(state) {
    Vue.set(state, 'activeToCall', false)
    Vue.set(state, 'callQueue', [])
  },

  SOCKET_RESPONSE_CALL_STATUS(state) {
    clearTimeout(state.broadcastRequestCallStatus)

    Vue.set(state, 'broadcastRequestCallStatus', null)
    Vue.set(state, 'activeToCall', false)
  }
}
