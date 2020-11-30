import { axiosDispatch, buildQuery } from '@/utils'

const strategyPath = '/api/strategy'

const strategyActions = {
  setActiveStrategy: ({ commit, state }, strategyId) => {
    commit('setActiveStrategy', state.activeStrategy === strategyId ? null : strategyId)
  },

  setFilterTerm: ({ commit, dispatch }, term) => {
    commit('setFilterTerm', term)
    dispatch('getStrategies')
  },

  getStrategies: ({ commit, state }, action) => {
    if (action === 'isInfinite') {
      commit('incrementStrategyQueryPage')
    } else {
      commit('setLoadingStrategies', true)
      commit('resetStrategyQueryPage')
    }

    return axiosDispatch({
      url: `${strategyPath}${buildQuery(state.strategyQuery)}`,
      mutation: 'setStrategies'
    }).finally(() => commit('setLoadingStrategies', false))
  },

  getAvailableWorkspace: () => axiosDispatch({
    url: `${strategyPath}/workspace/available`,
    mutation: 'setAvailableWorkspace'
  }),

  addStrategy: ({ _ }, strategy) => axiosDispatch({
    url: `${strategyPath}?size=200`,
    method: 'POST',
    data: strategy,
    mutation: 'addStrategy'
  }),

  cloneStrategy: ({ _ }, { strategyClone, originId }) => axiosDispatch({
    url: `${strategyPath}/${originId}/clone`,
    method: 'POST',
    data: strategyClone,
    mutation: 'addStrategy'
  }),

  updateStrategy: ({ commit }, strategy) => axiosDispatch({
    url: `${strategyPath}/${strategy.id}`,
    method: 'PATCH',
    data: strategy,
    mutation: 'updateStrategy'
  }),

  deleteStrategy: ({ commit }, { strategyId }) => axiosDispatch({
    url: `${strategyPath}/${strategyId}`,
    method: 'DELETE'
  }).then(() => commit('deleteStrategy', { strategyId })),

  getStrategyAvailableWorkspaces: ({ _ }, strategyId) => axiosDispatch({
    url: `${strategyPath}/${strategyId}/workspace/available`,
    mutation: 'setStrategyAvailableWorkspaces'
  }),

  getAvaliableVariablesToTemplate: ({ _ }) => axiosDispatch({
    url: `${strategyPath}/template/variable`,
    mutation: 'setAvaliableVariablesToTemplate'
  }),

  addCommunication: ({ commit }, { newCommunication, strategyId }) => axiosDispatch({
    url: `${strategyPath}/${strategyId}/communication`,
    method: 'POST',
    data: newCommunication
  }).then(response => {
    commit('addCommunications', { response, strategyId })
    return response
  }),

  editCommunication: ({ _ }, { communication, strategyId }) => axiosDispatch({
    url: `${strategyPath}/${strategyId}/communication/${communication.id}`,
    method: 'PATCH',
    data: communication
  }),

  sortCommunications: ({ _ }, { sortedIds, strategyId }) => axiosDispatch({
    url: `${strategyPath}/${strategyId}/communication/sort`,
    method: 'PATCH',
    data: sortedIds
  }),

  deleteCommunication: ({ commit }, { communicationId, strategyId, trigger }) => axiosDispatch({
    url: `${strategyPath}/${strategyId}/communication/${communicationId}`,
    method: 'DELETE'
  }).then(() => commit('deleteCommunication', { communicationId, strategyId, trigger })),

  getCommunicationTemplate: ({ _ }, { communicationId, strategyId }) => axiosDispatch({
    url: `${strategyPath}/${strategyId}/communication/${communicationId}/template`
  }),

  changeCommunicationTemplate: ({ _ }, { template, communicationId, strategyId }) => axiosDispatch({
    url: `${strategyPath}/${strategyId}/communication/${communicationId}/template`,
    method: 'PUT',
    data: template
  }),

  incrementStrategySize(state) {
    state.strategySize = state.strategySize + 10
  },

  clearStrategySize(state) {
    state.strategySize = state.strategyInitialSize
  }
}

export default strategyActions
