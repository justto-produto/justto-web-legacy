const findStrategyIndex = (strategies, strategyId) => strategies.findIndex(s => s.id === strategyId)

const StrategyMutations = {
  updateStrategy: (state, strategyData) => {
    const { strategies } = state
    strategies.map((strategy, index) => {
      if (strategy.id === strategyData.id) strategies[index] = strategyData
    })
  },
  setStrategies: (state, strategies) => {
    for (const strategie of strategies) {
      if (strategie.triggers.length) {
        let comm = []
        for (const t of strategie.triggers) {
          comm = comm.concat(t.communications)
        }
        strategie.communications = comm
      } else {
        strategie.communications = []
      }
    }

    state.strategies = strategies
  },
  setStrategyAvailableWorkspaces: (state, workspaces) => (state.strategyAvailableWorkspaces = workspaces),
  addCommunications: (state, { response, strategyId }) => {
    const strategyIndex = findStrategyIndex(state.strategies, strategyId)
    // const strategyIndex = state.strategies.findIndex(s => s.id === strategyId)
    state.strategies[strategyIndex].communications.push(response)
  },
}

export default StrategyMutations
