import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const strategy = {
  state: {
    list: []
  },
  mutations,
  actions,
  getters
}

export default strategy
