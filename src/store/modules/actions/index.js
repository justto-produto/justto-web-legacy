import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const actionsModule = {
  state: {
    outcomeReasons: {
      UNSETTLED: {},
      ARCHIVED: {}
    },
    dropLawsuitReasons: {}
  },
  actions,
  getters,
  mutations
}

export default actionsModule
