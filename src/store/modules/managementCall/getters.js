export default {
  isActiveToCall(state) {
    return state.activeToCall
  },

  hasCallInQueue(state) {
    return state.callQueue.length > 0
  },

  firstCallInQueue(state) {
    return state.callQueue[0] || {}
  },

  getDialer(state) {
    return state.dialer
  }
}
