import Vue from 'vue'
const billingMutations = {
  setAllCustomers: (state, customers) => (state.allCustomers = customers.content),
  setMyCustomers: (state, customers) => Vue.set(state, 'myCustomers', customers),
  setCustomer: (state, customerData) => {
    Vue.set(state.currentCustomer, 'customerId', customerData.id)
    Vue.set(state.currentCustomer, 'customerName', customerData.name)
    Vue.set(state.currentCustomer, 'contracts', customerData.contracts)
  },
  setCustomerId: (state, customerId) => (state.currentCustomer.customerId = customerId),
  setContracts: (state, contracts) => Vue.set(state.currentCustomer, 'contracts', contracts),
  setPlans: (state, plans) => (state.plans = plans),
  setBillingDashboard: (state, billingDashboard) => (state.billingDashboard = billingDashboard),
  setTransactions: (state, transactions) => (state.currentCustomer.transactions = transactions),
  pushTransactions: (state, transactions) => (state.currentCustomer.transactions.content.push(...transactions.content)),
  setStartDate: (state, startDate) => (state.query.startDate = startDate),
  setFinishDate: (state, finishDate) => (state.query.finishDate = finishDate),
  setWorkspaceId: (state, workspaceId) => (state.query.workspaceId = workspaceId),
  setType: (state, type) => (state.query.type = type),
  setTerm: (state, term) => (state.query.term = term),
  setTableLoading: (state, tableLoading) => (state.tableLoading = tableLoading),
  addTransactionsQueryPage: (state) => (state.query.page += 1),
  resetTransactionsQueryPage: (state) => (state.query.page = 1),
  setContractDiscountList: (state, { data, payload }) => {
    Vue.set(state.contractDiscountList, payload, data)
  },
  setHoldings: (state, holdings) => Vue.set(state, 'holdings', holdings)
}

export default billingMutations
