import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const dispute = {
  state: {
    dispute: {
      id: 0
    },
    disputes: [],
    occurrence: [],
    tab: '0',
    query: {
      status: ['ENGAGEMENT'],
      campaigns: [],
      strategy: [],
      persons: [],
      dealDate: [],
      expirationDate: [],
      onlyFavorite: false,
      page: 1,
      size: 20,
      term: '',
      initialSize: 20,
      total: 0
    },
    hasFilters: false,
    statuses: {}
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default dispute
