import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const dispute = {
  state: {
    disputes: [],
    filters: {
      tab: '0',
      terms: {}
    }
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default dispute
