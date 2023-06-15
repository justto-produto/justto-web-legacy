const strategyGetters = {
  activeStrategy: state => state.activeStrategy,
  getStrategies: state => state?.strategies || { content: [] },
  activeStrategyModel: state => (state?.strategies?.content || []).find(({ id }) => id === state.activeStrategy),
  getAvailableWorkspaces: state => state.availableWorkspaces,
  getAvaliableVariablesToTemplate: state => state.avaliableVariablesToTemplate,
  getStrategiesLoadingStatus: state => state.isLoadingStrategies,
  getStrategiesById: state => strategyId => (state?.strategies?.content || []).find(({ id }) => Number(id) === Number(strategyId)) || {}
}

export default strategyGetters
