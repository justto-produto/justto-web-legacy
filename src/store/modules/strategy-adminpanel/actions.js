import axiosDispatcher from '@/store/axiosDispatcher.js'

const StrategyActions = {
  updateStrategy: ({ commit }, strategyData) =>
    commit('updateStrategy', strategyData),

  getStrategies: ({ commit }) => {
    return axiosDispatcher({
      url: '/api/strategy',
      mutation: 'setStrategies',
    })
  },
}

export default StrategyActions
