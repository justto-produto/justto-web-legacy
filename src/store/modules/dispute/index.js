import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const dispute = {
  state: {
    disputesVM: [],
    disputesDTO: [],
    initialLoad: false,
    alerts: [
      [], [], [], [], [], [], []
    ],
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
    statuses: {}
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default dispute
