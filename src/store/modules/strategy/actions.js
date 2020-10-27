import { axiosDispatch } from '@/utils'

const strategiesPath = 'api/strategies'

const strategyActions = {
  getStrategiesList({ _ }) {
    return axiosDispatch({
      url: `${strategiesPath}/list`,
      mutation: 'setImportedStrategies'
    })
  },
  getStrategyEngagement({ _ }, id) {
    return axiosDispatch({ url: `${strategiesPath}/${id}/engagement` })
  },
  editStrategyTemplate({ _ }, params) {
    return axiosDispatch({
      url: 'api/templates/',
      method: 'PUT',
      data: params
    })
  }
}

export default strategyActions
