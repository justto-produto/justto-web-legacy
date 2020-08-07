import axiosDispatcher from '@/store/axiosDispatcher.js'

const strategyPath = '/api/strategy'

const StrategyActions = {
  getStrategies: () => axiosDispatcher({
    url: strategyPath,
    mutation: 'setStrategies',
  }),

  getAvailableWorkspace: () => axiosDispatcher({
    url: 'api/strategy/workspace/available',
    mutation: 'setAvailableWorkspace',
  }),

  addStrategy: ({ _ }, strategy) => axiosDispatcher({
    url: strategyPath,
    method: 'POST',
    data: strategy,
    mutation: 'addStrategy',
  }),

  cloneStrategy: ({ _ }, { strategyClone, originId }) => axiosDispatcher({
    url: `${strategyPath}/${originId}/clone`,
    method: 'POST',
    data: strategyClone,
    mutation: 'addStrategy',
  }),

  updateStrategy: ({ commit }, strategy) => axiosDispatcher({
    url: `${strategyPath}/${strategy.id}`,
    method: 'PATCH',
    data: strategy,
    mutation: 'updateStrategy',
  }),

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

  deleteCommunication: ({ commit }, { communicationId, strategyId, trigger }) => axiosDispatcher({
    url: `${strategyPath}/${strategyId}/communication/${communicationId}`,
    method: 'DELETE',
  }).then(() => commit('deleteCommunication', { communicationId, strategyId, trigger })),

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
