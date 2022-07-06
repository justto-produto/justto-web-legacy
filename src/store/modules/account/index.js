import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const account = {
  state: {
    id: '',
    name: '',
    email: '',
    token: localStorage.getItem('justoken') || '',
    devs: [
      'josewilliam@justto.com.br',
      'lucas@justto.com.br',
      'daniel@justto.com.br',
      'guilherme@justto.com.br',
      'deivid@justto.com.br',
      'micaias@justto.com.br',
      'danilo.rosa@justto.com.br'
    ],
    preferences: {
      tourSteps: {},
      properties: {
        NEGOTIATION_SCREEN: false
      }
    },
    preventScheduleCallsConfirmation: false
  },
  mutations,
  actions,
  getters
}

export default account
