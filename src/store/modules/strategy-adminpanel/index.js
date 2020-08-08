import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const StrategyModule = {
  state: {
    strategies: [],
    availableWorkspaces: [],
    avaliableVariablesToTemplate: {},
    strategyInitialSize: 20,
    strategySize: 20,
  },
  actions,
  getters,
  mutations,
}

export default StrategyModule
