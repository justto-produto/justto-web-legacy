const strategyGetters = {
  activeStrategy: state => state.activeStrategy,
  getStrategies: state => state.strategies,
  getAvailableWorkspaces: state => state.availableWorkspaces,
  getAvaliableVariablesToTemplate: state => state.avaliableVariablesToTemplate,
  getStrategiesLoadingStatus: state => state.isLoadingStrategies
}

export default strategyGetters
