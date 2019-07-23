import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const socketModule = {
  state: {
    chat: {
      typing: '',
      join: '',
      leave: '',
      message: ''
    },
    whatsapp: {
      qrCode: '',
      status: 'OFFLINE',
      number: ''
    }
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default socketModule
