const findStrategyIndex = (strategies, strategyId) => strategies.findIndex(s => s.id === strategyId)
const findCommunicationIndex = (communications, communicationId) => communications.findIndex(c => c.id === communicationId)

const StrategyMutations = {
  addStrategy: (state, strategy) => (state.strategies.push(strategy)),
  updateStrategy: (state, strategyData) => {
    const { strategies } = state
    const strategyIndex = findStrategyIndex(strategies, strategyData.id)
    strategies[strategyIndex] = strategyData
  },
  setStrategies: (state, strategies) => (state.strategies = strategies),
  setAvailableWorkspace: (state, availableWorkspaces) => (state.availableWorkspaces = availableWorkspaces),
  setAvaliableVariablesToTemplate: (state, variables) => (state.avaliableVariablesToTemplate = variables),
  addCommunications: (state, { response, strategyId }) => {
    const { strategies } = state
    const strategyIndex = findStrategyIndex(strategies, strategyId)
    let trigger = strategies[strategyIndex].triggers
    if (!trigger[response.triggerType]) trigger[response.triggerType] = { communications: [] }
    trigger[response.triggerType].communications.push(response)
  },
  deleteCommunication: (state, { communicationId, strategyId, trigger }) => {
    const { strategies } = state
    const strategyIndex = findStrategyIndex(strategies, strategyId)
    const communicationIndex = findCommunicationIndex(strategies[strategyIndex].communications, communicationId)
    strategies[strategyIndex].triggers[trigger].communications.splice(communicationIndex, 1)
  },
}

export default StrategyMutations
