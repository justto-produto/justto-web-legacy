import acts from './actions'
import getters from './getters'
import mutations from './mutations'

const actions = {
  state: {
    outcomeReasons: {
      UNSETTLED: {},
      ARCHIVED: {}
    }
  },
  actions: acts,
  getters,
  mutations
}

export default actions
