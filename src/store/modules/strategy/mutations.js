const strategyMutations = {
  setImportedStrategies(state, response) {
    state.list = response.content
  }
}

export default strategyMutations
