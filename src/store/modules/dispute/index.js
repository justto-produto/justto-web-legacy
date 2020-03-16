import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const dispute = {
  state: {
    dispute: {
      id: 0
    },
    disputes: [],
    occurrences: [],
    occurrencesInitialSize: 20,
    occurrencesSize: 20,
    summaryNearExpirations: [],
    summaryNotVisualizeds: [],
    tab: '0',
    hasNew: false,
    query: {
      status: ['ENGAGEMENT'],
      sort: ['expirationDate,asc', 'favorite,desc'],
      campaigns: [],
      strategy: [],
      persons: [],
      expirationDate: [],
      dealDate: [],
      prescriptions: [],
      onlyFavorite: false,
      page: 1,
      size: 20,
      term: '',
      total: 0
    },
    hasFilters: false,
    statuses: {},
    respondents: []
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default dispute
