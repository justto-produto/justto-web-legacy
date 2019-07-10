import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const dispute = {
  state: {
    disputes: [],
    filters: {
      tab: '0',
      filterPersonId: 0,
      terms: {},
      sort: {
        prop: '',
        order: null
      }
    },
    disputeStatuses: {}
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default dispute
