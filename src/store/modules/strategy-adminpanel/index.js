import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const StrategyModule = {
  state: {
    strategies: [],
    availableWorkspaces: [],
    avaliableVariablesToTemplate: {},
  },
  actions,
  getters,
  mutations,
}

export default StrategyModule
