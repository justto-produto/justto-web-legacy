import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const dispute = {
  state: {
    disputes: [],
    occurrence: [],
    filter: {
      persons: [],
      campaigns: [],
      expirationDateTime: {}
    },
    query: {
      page: 1,
      size: 4,
      initialsize: 4,
      total: 0
    },
    statuses: {}
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default dispute
