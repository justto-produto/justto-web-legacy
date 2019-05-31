import disputeMutations from './mutations'
import disputeActions from './actions'
import disputeGetters from './getters'

const dispute = {
  state: {
    disputes: [],
    filters: {
      tab: '0',
      terms: {}
    }
  },
  mutations: disputeMutations,
  actions: disputeActions,
  getters: disputeGetters
}

export default dispute
