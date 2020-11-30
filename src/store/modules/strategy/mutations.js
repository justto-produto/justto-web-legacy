const strategyMutations = {
  setImportedStrategies(state, response) {
    state.list = response.content || response
  }
}

export default strategyMutations
