import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const personModule = {
  state: {
    currentPerson: {}
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default personModule
