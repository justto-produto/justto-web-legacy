import Vue from 'vue'

const findStrategyIndex = (strategies, strategyId) => strategies.content.findIndex(s => s.id === strategyId)
const findCommunicationIndex = (communications, communicationId) => communications.findIndex(c => c.id === communicationId)

const StrategyMutations = {
  addStrategy: (state, strategy) => (state.strategies.content.push(strategy)),
  deleteStrategy: (state, { strategyId }) => {
    const strategyIndex = findStrategyIndex(state.strategies, strategyId)
    state.strategies.content.splice(strategyIndex, 1)
  },
  updateStrategy: (state, strategyData) => {
    const strategyIndex = findStrategyIndex(state.strategies, strategyData.id)
    state.strategies.content[strategyIndex] = strategyData
  },
  setStrategies: (state, strategies) => {
    if (strategies.first) state.strategies = strategies
    else state.strategies.content.push(...strategies.content)
  },
  addCommunications: (state, { response, strategyId }) => {
    const { strategies } = state
    const strategyIndex = findStrategyIndex(strategies, strategyId)
    const trigger = strategies[strategyIndex].triggers
    if (!trigger[response.triggerType]) {
      Vue.set(trigger, response.triggerType, { communications: [] })
    }
    Vue.set(trigger[response.triggerType].communications, trigger[response.triggerType].communications.length, response)
    const communicationType = response.type
    let quantity = 0
    if (strategies[strategyIndex].triggers[response.triggerType].communicationsTypeSummary) {
      quantity = strategies[strategyIndex].triggers[response.triggerType].communicationsTypeSummary[communicationType]
      Vue.set(strategies[strategyIndex].triggers[response.triggerType].communicationsTypeSummary, communicationType, (quantity + 1))
    }
  },
  deleteCommunication: (state, { communicationId, strategyId, trigger }) => {
    const { strategies } = state
    const strategyIndex = findStrategyIndex(strategies, strategyId)
    const communicationIndex = findCommunicationIndex(strategies[strategyIndex].triggers[trigger].communications, communicationId)
    const communicationType = strategies[strategyIndex].triggers[trigger].communications[communicationIndex].type
    Vue.delete(strategies[strategyIndex].triggers[trigger].communications, communicationIndex)
    const quantity = strategies[strategyIndex].triggers[trigger].communicationsTypeSummary[communicationType]
    Vue.set(strategies[strategyIndex].triggers[trigger].communicationsTypeSummary, communicationType, (quantity - 1))
  },
  setAvailableWorkspace: (state, availableWorkspaces) => (state.availableWorkspaces = availableWorkspaces),
  setAvaliableVariablesToTemplate: (state, variables) => (state.avaliableVariablesToTemplate = variables),
  setFilterTerm: (state, term) => (state.strategyQuery.name = term),
  incrementStrategyQueryPage: (state) => (state.strategyQuery.page += 1),
  resetStrategyQueryPage: (state) => (state.strategyQuery.page = 1),
  setLoadingStrategies: (state, status) => (state.isLoadingStrategies = status),
}

export default StrategyMutations
