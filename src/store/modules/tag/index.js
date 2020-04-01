import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const tagModule = {
  state: {
    workspaceTags: [],
    disputeTags: []
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default tagModule
