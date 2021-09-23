export default {
  isActiveToCall(state) {
    return state.activeToCall
  },

  firstCallInQueue(state) {
    return state.callQueue[0] || {}
  },

  getDialer(state) {
    return state.dialer
  },

  getCurrentCall(state) {
    return state.activeToCall ? state.currentCall : state.sharedManagementCall?.currentCall
  },

  getAppInstance(state) {
    return state.appInstance
  },

  getCallQueue(state) {
    return state.activeToCall ? (state.callQueue || []) : (state.sharedManagementCall.callQueue || [])
  },

  hasCallInQueue(state, getters) {
    return getters.getCallQueue?.length > 0
  },

  isOpenCall(state, getters) {
    const currentCall = getters.getCurrentCall
    return currentCall?.state === 'ACTIVE'
  }
}
