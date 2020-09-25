import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const StrategyModule = {
  state: {
    activeStrategy: null,
    strategies: {},
    availableWorkspaces: [],
    avaliableVariablesToTemplate: {},
    isLoadingStrategies: false,
    strategyQuery: {
      size: 10,
      page: 1,
      name: '',
      sort: [
        'active,desc',
        'name,asc'
      ]
    }
  },
  actions,
  getters,
  mutations
}

export default StrategyModule
