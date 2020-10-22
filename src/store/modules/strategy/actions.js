import axiosDispatcher from '@/store/axiosDispatcher'

const strategiesPath = 'api/strategies'

const strategyActions = {
  getStrategiesList({ _ }) {
    return axiosDispatcher({
      url: `${strategiesPath}/list`,
      mutation: 'setImportedStrategies'
    })
  },
  getStrategyEngagement({ _ }, id) {
    return axiosDispatcher({ url: `${strategiesPath}/${id}/engagement` })
  },
  editStrategyTemplate({ _ }, params) {
    return axiosDispatcher({
      url: 'api/templates/',
      method: 'PUT',
      data: params
    })
  }
}

export default strategyActions
