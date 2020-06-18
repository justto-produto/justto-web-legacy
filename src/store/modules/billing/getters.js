const billingGetters = {
  getCusomers: state => state.customers,
  getCurrentCustomer: state => state.currentCustomer,
  getDateRange: state => ({
    startDate: state.startDate,
    finishDate: state.finishDate,
  }),
  getWorkspace: state => state.workspaceId,
}

export default billingGetters
