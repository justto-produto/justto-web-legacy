import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const dispute = {
  state: {
    disputesDTO: [],
    filters: {
      tab: '0',
      filterPersonId: 0,
      terms: {},
      filterTerm: '',
      perPage: 20,
      sort: {
        prop: null,
        order: null
      }
    },
    statuses: {},
    updatingList: []
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default dispute
