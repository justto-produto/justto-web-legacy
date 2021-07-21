import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const billing = {
  state: {
    allCustomers: [],
    myCustomers: [],
    currentCustomer: {
      contracts: [],
      customerId: null,
      customerName: '',
      transactions: {}
    },
    query: {
      startDate: '',
      finishDate: '',
      workspaceId: null,
      type: '',
      term: '',
      size: 20,
      page: 1
    },
    plans: [],
    billingDashboard: {},
    tableLoading: false,
    contractDiscountList: {}
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default billing
