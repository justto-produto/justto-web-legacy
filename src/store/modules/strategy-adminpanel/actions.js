import axiosDispatcher from '@/store/axiosDispatcher.js'

const StrategyActions = {
  getStrategies: () => axiosDispatcher({
    url: '/api/strategy',
    mutation: 'setStrategies',
  }),

  addStrategy: ({ dispatch }, strategy) => axiosDispatcher({
    url: '/api/strategy',
    method: 'POST',
    data: strategy,
  }).then(() => dispatch('getStrategies')),

  getStrategyAvailableWorkspaces: ({ _ }, strategyId) => axiosDispatcher({
    url: `/api/strategy/${strategyId}/workspace/available`,
    mutation: 'setStrategyAvailableWorkspaces',
  }),
}

export default StrategyActions
