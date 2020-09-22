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
      'gabriel@justto.com.br',
      'guilherme@justto.com.br'
    ],
    preferences: { tourSteps: {} },
  },
  actions,
  getters,
  mutations,
}

export default account
