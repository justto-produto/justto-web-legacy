import { ClientModel } from '../../../models/billing/Client.model'

const billingGetters = {
  getAllCusomers: state => state.allCustomers,
  getMyCusomers: state => state.myCustomers,
  getCurrentCustomer: state => new ClientModel(state.currentCustomer),
  getPlans: state => state.plans,
  transactions: state => state.currentCustomer.transactions,
  billingDashboard: state => state.billingDashboard,
  tableLoading: state => state.tableLoading,
  currentWorkspace: state => state.query.workspaceId,
  contractDiscountList: state => state.contractDiscountList,
  getHoldingsList: state => state.holdings,
  cusomersMappedById: state => state.myCustomers.reduce((acc, cur) => {
    acc[cur.id] = cur
    return acc
  }, {})
}

export default billingGetters
