import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const dispute = {
  state: {
    disputes: [],
    occurrence: [],
    tab: '0',
    filters: {
      status: ['ENGAGEMENT']
    },
    query: {
      page: 1,
      size: 20,
      initialsize: 20,
      total: 0
    },
    statuses: {}
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default dispute
