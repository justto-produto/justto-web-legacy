import acts from './actions'
import getters from './getters'
import mutations from './mutations'

const actions = {
  state: {
    outcomeReasons: {
      UNSETTLED: {},
      ARCHIVED: {}
    },
    dropLawsuitReasons: {},
    thamirisAlertVisible: true
  },
  actions: acts,
  getters,
  mutations
}

export default actions
