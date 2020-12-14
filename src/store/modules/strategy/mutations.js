const strategyMutations = {
  setImportedStrategies(state, response) {
    state.list = response.content || response
  },
  setImportedStrategiesLite(state, response) {
    state.importationList = response.content || response
  }
}

export default strategyMutations
