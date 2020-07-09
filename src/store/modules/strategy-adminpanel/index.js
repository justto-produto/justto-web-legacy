import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const StrategyModule = {
  state: {
    strategies: [],
    strategyAvailableWorkspaces: [],
  },
  actions,
  getters,
  mutations,
}

export default StrategyModule
