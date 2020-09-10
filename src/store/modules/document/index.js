import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const document = {
  state: {
    availableSigners: [],
    selectedSigners: []
  },
  mutations: mutations,
  actions: actions,
  getters: getters,
}

export default document
