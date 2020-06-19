import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const billing = {
  state: {
    customers: [],
    currentCustomer: {
      contracts: [],
      customerId: 67,
      transactions: null,
    },
    query: {
      startDate: '',
      finishDate: '',
      workspaceId: null,
      type: '',
      term: '',
    },
    billingDashboard: {},
  },
  mutations: mutations,
  actions: actions,
  getters: getters,
}

export default billing
