import Vue from 'vue'

const findStrategyIndex = (strategies, strategyId) => strategies.content.findIndex(s => s.id === strategyId)
const findCommunicationIndex = (communications, communicationId) => communications.findIndex(c => c.id === communicationId)

const strategyMutations = {
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
    const strategyIndex = findStrategyIndex(state.strategies, strategyId)
    const triggers = state.strategies.content[strategyIndex].triggers
    const triggerType = response.triggerType
    const communicationType = response.type
    if (!triggers[triggerType]) {
      Vue.set(triggers, triggerType, { communications: [] })
      Vue.set(triggers[triggerType], 'communicationsTypeSummary', {})
    }
    if (!triggers[triggerType].communicationsTypeSummary[communicationType]) {
      Vue.set(triggers[triggerType].communicationsTypeSummary, communicationType, 0)
    }
    triggers[triggerType].communications.push(response)
    triggers[triggerType].communicationsTypeSummary[communicationType] += 1
  },
  deleteCommunication: (state, { communicationId, strategyId, trigger }) => {
    const strategyIndex = findStrategyIndex(state.strategies, strategyId)
    const triggers = state.strategies?.content[strategyIndex]?.triggers[trigger]
    const communications = triggers?.communications
    const communicationIndex = findCommunicationIndex(communications, communicationId)
    const communicationType = communications[communicationIndex]?.type

    if (communicationType) {
      Vue.delete(communications, communicationIndex)
      triggers.communicationsTypeSummary[communicationType] -= 1
    }
  },
  setActiveStrategy: (state, activeStrategy) => (state.activeStrategy = activeStrategy),
  setAvailableWorkspace: (state, availableWorkspaces) => (state.availableWorkspaces = availableWorkspaces),
  setAvaliableVariablesToTemplate: (state, variables) => (state.avaliableVariablesToTemplate = variables),
  setFilterTerm: (state, term) => (state.strategyQuery.name = term),
  incrementStrategyQueryPage: (state) => (state.strategyQuery.page += 1),
  resetStrategyQueryPage: (state) => (state.strategyQuery.page = 1),
  setLoadingStrategies: (state, status) => (state.isLoadingStrategies = status)
}

export default strategyMutations
