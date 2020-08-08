import Vue from 'vue'

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
  deleteStrategy: (state, { strategyId }) => {
    const { strategies } = state
    const strategyIndex = findStrategyIndex(strategies, strategyId)
    strategies.splice(strategyIndex, 1)
  },
  addCommunications: (state, { response, strategyId }) => {
    const { strategies } = state
    const strategyIndex = findStrategyIndex(strategies, strategyId)
    let trigger = strategies[strategyIndex].triggers
    if (!trigger[response.triggerType]) {
      Vue.set(trigger, response.triggerType, { communications: [] })
    }
    Vue.set(trigger[response.triggerType].communications, trigger[response.triggerType].communications.length, response)
    let communicationType = response.type
    let quantity = strategies[strategyIndex].triggers[response.triggerType].communicationsTypeSummary[communicationType]
    Vue.set(strategies[strategyIndex].triggers[response.triggerType].communicationsTypeSummary, communicationType, (quantity+1))
  },
  deleteCommunication: (state, { communicationId, strategyId, trigger }) => {
    const { strategies } = state
    const strategyIndex = findStrategyIndex(strategies, strategyId)
    const communicationIndex = findCommunicationIndex(strategies[strategyIndex].triggers[trigger].communications, communicationId)
    let communicationType = strategies[strategyIndex].triggers[trigger].communications[communicationIndex].type
    Vue.delete(strategies[strategyIndex].triggers[trigger].communications, communicationIndex)
    let quantity = strategies[strategyIndex].triggers[trigger].communicationsTypeSummary[communicationType]
    Vue.set(strategies[strategyIndex].triggers[trigger].communicationsTypeSummary, communicationType, (quantity-1))
  },
  incrementStrategySize(state) {
    state.strategySize = state.strategySize + 10
  },
  clearStrategySize(state) {
    state.strategySize = state.strategyInitialSize
  },
}

export default StrategyMutations
