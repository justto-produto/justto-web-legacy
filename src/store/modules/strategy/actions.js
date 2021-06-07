import { axiosDispatch } from '@/utils'

const strategiesPath = 'api/strategies/v1'

const strategyActions = {
  getMyStrategiesLite({ _ }) {
    return axiosDispatch({
      url: `${strategiesPath}`,
      mutation: 'setImportedStrategiesLite'
    })
  },

  getStrategyEngagementLite({ _ }, strategyId) {
    return axiosDispatch({
      url: `${strategiesPath}/${strategyId}/communications`,
      mutation: 'setStrategyCommunication',
      payload: { strategyId }
    })
  },

  getStrategyCommunicationTemplate({ _ }, { strategyId, comunicationId }) {
    return axiosDispatch({
      url: `${strategiesPath}/${strategyId}/communications/${comunicationId}/template`,
      mutation: 'setStrategyCommunicationTemplate',
      payload: { strategyId, comunicationId }
    })
  },

  editStrategyTemplate({ _ }, params) {
    return axiosDispatch({
      url: 'api/templates/',
      method: 'PUT',
      data: params
    })
  },

  createStrategyTemplate({ _ }, params) {
    return axiosDispatch({
      url: 'api/templates/',
      method: 'POST',
      data: params
    })
  },

  getStrategyTemplate({ _ }, templateId) {
    return axiosDispatch({
      url: `api/templates/${templateId}`
    })
  }
}

export default strategyActions
