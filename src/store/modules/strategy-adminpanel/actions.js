import axiosDispatcher from '@/store/axiosDispatcher.js'

const StrategyActions = {
  getStrategies: ({ commit }) => {
    return axiosDispatcher({
      url: '/api/strategy',
      mutation: 'setStrategies',
    })
  },
}

export default StrategyActions
