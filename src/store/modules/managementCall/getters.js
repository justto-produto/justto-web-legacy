import { CALL_STATUS } from '@/constants/callStatus'
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
    return state.activeToCall
      ? state.currentCall
      : state.sharedManagementCall?.currentCall
  },

  getAppInstance(state) {
    return state.appInstance
  },

  getCallQueue(state) {
    return state.activeToCall
      ? state.callQueue || []
      : state.sharedManagementCall.callQueue || []
  },

  hasCallInQueue(state, getters) {
    return getters.getCallQueue?.length > 0
  },

  isOpenCall(state, getters) {
    const currentCall = getters.getCurrentCall
    return currentCall?.state === 'ACTIVE'
  },

  hasOtherTabActive(state) {
    return !state.activeToCall &&
            state.sharedManagementCall?.appInstance &&
            state.sharedManagementCall?.appInstance !== state.appInstance
  },

  isPendingToAnswerCurrentCall(state) {
    return state.activeToCall && state?.currentCall?.status === CALL_STATUS.RECEIVING_CALL
  }
}
