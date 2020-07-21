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

  addCommunication({ commit }, { newCommunication, strategyId }) {
    return axiosDispatcher({
      url: `${strategyPath}/${strategyId}/communication`,
      method: 'POST',
      data: newCommunication,
    }).then(response => {
      commit('addCommunications', { response, strategyId })
    })
  },

  editCommunicationName: ({ _ }, { communication, strategyId }) => axiosDispatcher({
    url: `${strategyPath}/${strategyId}/communication/${communication.id}`,
    method: 'PATCH',
    data: communication,
  }),

  sortCommunications: ({ _ }, { sortedIds, strategyId }) => axiosDispatcher({
    url: `${strategyPath}/${strategyId}/communication/sort`,
    method: 'PATCH',
    data: sortedIds,
  }),

  deleteCommunication: ({ _ }, { communicationId, strategyId }) => axiosDispatcher({
    url: `${strategyPath}/${strategyId}/communication/${communicationId}`,
    method: 'DELETE',
  }),
}

export default StrategyActions
