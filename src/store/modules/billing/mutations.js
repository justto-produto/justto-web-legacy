const mutations = {
  setAllCustomers: (state, customers) => (state.allCustomers = customers.content),
  setMyCustomers: (state, customers) => (state.myCustomers = customers),
  setCustomer: (state, customerData) => {
    state.currentCustomer.customerId = customerData.id
    state.currentCustomer.customerName = customerData.name
    state.currentCustomer.contracts = customerData.contracts
  },
  setContracts: (state, contracts) => (state.currentCustomer.contracts = contracts),
  setBillingDashboard: (state, billingDashboard) => (state.billingDashboard = billingDashboard),
  setTransactions: (state, transactions) => (state.currentCustomer.transactions = transactions),
  setStartDate: (state, startDate) => (state.query.startDate = startDate),
  setFinishDate: (state, finishDate) => (state.query.finishDate = finishDate),
  setWorkspaceId: (state, workspaceId) => (state.query.workspaceId = workspaceId),
  setType: (state, type) => (state.query.type = type),
  setTerm: (state, term) => (state.query.term = term),
}

export default mutations
