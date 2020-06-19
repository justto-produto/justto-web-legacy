const billingMutations = {
  setCustomers: (state, customers) => (state.customers = customers),
  setDashboardData: (state, dashboardData) => (state.currentCustomer.dashboardData = dashboardData),
  setCustomer: (state, customerId) => (state.currentCustomer.customerId = customerId),
  setContracts: (state, contracts) => (state.currentCustomer.contracts = contracts),
  setStartDate: (state, startDate) => (state.startDate = startDate),
  setFinishDate: (state, finishDate) => (state.finishDate = finishDate),
  setWorkspace: (state, workspaceId) => (state.workspaceId = workspaceId),
}

export default billingMutations
