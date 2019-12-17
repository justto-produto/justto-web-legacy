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
    occurrencesInitialSize: 10,
    occurrencesSize: 10,
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
      onlyFavorite: false,
      page: 1,
      size: 20,
      term: '',
      initialSize: 20,
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
