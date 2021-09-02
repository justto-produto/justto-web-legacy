import PauseReasonModel from './model/PauseReasonModel'
import DialerUserModel from './model/DialerUserModel'
import VoiceServerModel from './model/VoiceServerModel'
import ServiceStatusModel from './model/ServiceStatusModel'

const dialerMutations = {
  setVoiceServer(state, server) {
    state.voiceServer = new VoiceServerModel(server)
  },

  setCurrentDialerUser(state, user) {
    if (!(user instanceof DialerUserModel)) {
      user = new DialerUserModel(user)
    }
    state.currentDialerUser = user
  },

  setLoggedToken(state, tokens) {
    Object.assign(state.currentDialerUser, {
      token: tokens.ret_token
    })
  },

  setPauseReasons(state, reasons) {
    state.pauseReasons = reasons.map(r => new PauseReasonModel(r))
  },

  clearCurrentServer(state) {
    this.setCurrentDialerUser(state, new DialerUserModel())
    this.setVoiceServer(state, new VoiceServerModel())
  },

  setServiceStatus(state, serviceStatus) {
    if (state.voiceServer) {
      if (serviceStatus) {
        serviceStatus = serviceStatus.map(r => new ServiceStatusModel(r))
      }
      state.voiceServer.serviceStatus = serviceStatus
    }
  },

  setCurrentCallId(state, { _id }) {
    if (!state.call) {
      state.call = {
        id: _id,
        status: 'STARTING'
      }
    } else {
      state.call.id = _id
    }
  },

  clearCall(state) {
    state.call = null
  },

  createCall(state) {
    state.call = {
      id: null,
      status: 'STARTING'
    }
  }
}

export default dialerMutations
