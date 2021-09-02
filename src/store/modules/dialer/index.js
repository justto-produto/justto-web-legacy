import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import DialerUserModel from './model/DialerUserModel'
import VoiceServerModel from './model/VoiceServerModel'
import DialerMediaAssets from './model/DialerMediaAssets'

const dialer = {
  state: {
    currentDialerUser: new DialerUserModel(),
    voiceServer: new VoiceServerModel(),
    pauseReasons: [],
    dialerAssets: new DialerMediaAssets(),
    dialerOrganizationId: '5c60c99d7b2e323f65954af5',
    call: null
  },
  mutations,
  actions,
  getters
}

export default dialer
