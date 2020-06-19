import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const billing = {
  state: {
    allCustomers: [],
    myCustomers: [],
    currentCustomer: {
      contracts: [],
      customerId: '',
      customerName: '',
      transactions: null,
    },
    query: {
      startDate: '',
      finishDate: '',
      workspaceId: null,
      type: '',
      term: '',
      size: 9999,
    },
    billingDashboard: {},
  },
  mutations: mutations,
  actions: actions,
  getters: getters,
}

export default billing
