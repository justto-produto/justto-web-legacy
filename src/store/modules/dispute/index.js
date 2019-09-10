import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const dispute = {
  state: {
    disputes: [],
    occurrence: [],
    initialLoad: false,
    filters: {
      tab: '0',
      filterPersonId: 0,
      terms: {},
      filterTerm: '',
      priorityOnly: false,
      perPage: 20,
      sort: {
        prop: null,
        order: null
      }
    },
    statuses: {}
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default dispute
