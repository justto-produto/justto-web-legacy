const StrategyMutations = {
  updateStrategy: (state, strategyData) => {
    const { strategies } = state
    strategies.map((strategy, index) => {
      if (strategy.id === strategyData.id) strategies[index] = strategyData
    })
  },
  setStrategies: (state, strategies) => (state.strategies = strategies),
}

export default StrategyMutations
