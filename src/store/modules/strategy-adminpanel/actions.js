import axiosDispatcher from '@/store/axiosDispatcher.js'

const strategyPath = '/api/strategy'

const StrategyActions = {
  getStrategies: () => axiosDispatcher({
    url: strategyPath,
    mutation: 'setStrategies',
  }),

  addStrategy: ({ dispatch }, strategy) => axiosDispatcher({
    url: strategyPath,
    method: 'POST',
    data: strategy,
  }).then(() => dispatch('getStrategies')),

  cloneStrategy: ({ dispatch }, { strategyClone, originId }) => axiosDispatcher({
    url: `${strategyPath}/${originId}/clone`,
    method: 'POST',
    data: strategyClone,
  }).then(() => dispatch('getStrategies')),

  updateStrategy: ({ dispatch }, strategy) => axiosDispatcher({
    url: `${strategyPath}/${strategy.id}`,
    method: 'PATCH',
    data: strategy,
  }).then(() => dispatch('getStrategies')),

  getStrategyAvailableWorkspaces: ({ _ }, strategyId) => axiosDispatcher({
    url: `${strategyPath}/${strategyId}/workspace/available`,
    mutation: 'setStrategyAvailableWorkspaces',
  }),

  getAvaliableVariablesToTemplate: ({ _ }) => axiosDispatcher({
    url: `${strategyPath}/template/variable`,
    mutation: 'setAvaliableVariablesToTemplate',
  }),

  addCommunication: ({ commit }, { newCommunication, strategyId }) => axiosDispatcher({
    url: `${strategyPath}/${strategyId}/communication`,
    method: 'POST',
    data: newCommunication,
  }).then(response => {
    commit('addCommunications', { response, strategyId })
    return response
  }),

  editCommunication: ({ _ }, { communication, strategyId }) => axiosDispatcher({
    url: `${strategyPath}/${strategyId}/communication/${communication.id}`,
    method: 'PATCH',
    data: communication,
  }),

  sortCommunications: ({ _ }, { sortedIds, strategyId }) => axiosDispatcher({
    url: `${strategyPath}/${strategyId}/communication/sort`,
    method: 'PATCH',
    data: sortedIds,
  }),

  deleteCommunication: ({ commit }, { communicationId, strategyId }) => axiosDispatcher({
    url: `${strategyPath}/${strategyId}/communication/${communicationId}`,
    method: 'DELETE',
  }).then(() => commit('deleteCommunication', { communicationId, strategyId })),

  getCommunicationTemplate: ({ _ }, { communicationId, strategyId }) => axiosDispatcher({
    url: `${strategyPath}/${strategyId}/communication/${communicationId}/template`,
  }),

  changeCommunicationTemplate: ({ _ }, { template, communicationId, strategyId }) => axiosDispatcher({
    url: `${strategyPath}/${strategyId}/communication/${communicationId}/template`,
    method: 'PUT',
    data: template,
  }),
}

export default StrategyActions
