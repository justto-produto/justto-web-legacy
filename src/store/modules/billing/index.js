import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const billing = {
  state: {
    allCustomers: [],
    myCustomers: [],
    currentCustomer: {
      contracts: [],
      customerId: 70,
      customerName: '',
      transactions: [],
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
    tableLoading: false,
  },
  mutations: mutations,
  actions: actions,
  getters: getters,
}

export default billing
