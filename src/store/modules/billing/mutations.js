const mutations = {
  setCustomers: (state, customers) => (state.customers = customers),
  setTransactions: (state, transactions) => (state.currentCustomer.transactions = transactions),
  setCustomer: (state, customerId) => (state.currentCustomer.customerId = customerId),
  setContracts: (state, contracts) => (state.currentCustomer.contracts = contracts),
  setStartDate: (state, startDate) => (state.query.startDate = startDate),
  setFinishDate: (state, finishDate) => (state.query.finishDate = finishDate),
  setWorkspaceId: (state, workspaceId) => (state.query.workspaceId = workspaceId),
  setType: (state, type) => (state.query.type = type),
  setTerm: (state, term) => (state.query.term = term),
}

export default mutations
