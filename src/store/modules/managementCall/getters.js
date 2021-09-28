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

  hasCallInQueue(state) {
    return state.callQueue?.length > 0
  },

  isOpenCall(state) {
    return state.currentCall?.status === CALL_STATUS.ACTIVE_CALL
  },

  hasOtherTabActive(state) {
    return !state.activeToCall &&
            state.sharedManagementCall?.appInstance &&
            state.sharedManagementCall?.appInstance !== state.appInstance
  },

  isPendingToAnswerCurrentCall(state) {
    return state.activeToCall && state?.currentCall?.status === CALL_STATUS.RECEIVING_CALL
  },

  isToIgnoreDialer(state) {
    return state.ignoreDialer
  }
}
