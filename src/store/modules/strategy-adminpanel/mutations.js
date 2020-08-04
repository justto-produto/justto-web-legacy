const findStrategyIndex = (strategies, strategyId) => strategies.findIndex(s => s.id === strategyId)
const findCommunicationIndex = (communications, communicationId) => communications.findIndex(c => c.id === communicationId)

const StrategyMutations = {
  addStrategy: (state, strategy) => {
    state.strategies.push(strategy)
  },
  updateStrategy: (state, strategyData) => {
    const { strategies } = state
    strategies.map((strategy, index) => {
      if (strategy.id === strategyData.id) strategies[index] = strategyData
    })
  },
  setStrategies: (state, strategies) => {
    for (const strategie of strategies) {
      if (strategie.triggers && strategie.triggers.length) {
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
  setAvaliableVariablesToTemplate: (state, variables) => (state.avaliableVariablesToTemplate = variables),

  addCommunications: (state, { response, strategyId }) => {
    const strategyIndex = findStrategyIndex(state.strategies, strategyId)
    state.strategies[strategyIndex].communications.push(response)
  },
  deleteCommunication: (state, { communicationId, strategyId }) => {
    const strategyIndex = findStrategyIndex(state.strategies, strategyId)
    const communicationIndex = findCommunicationIndex(state.strategies[strategyIndex].communications, communicationId)
    state.strategies[strategyIndex].communications.splice(communicationIndex, 1)
  },
}

export default StrategyMutations
