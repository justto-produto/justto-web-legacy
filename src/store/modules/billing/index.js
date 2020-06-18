const billingModule = {
  state: {
    customers: [],
    currentCustomer: {
      contracts: [],
      customerId: null,
      dashboardData: null,
    },
    startDate: '',
    finishDate: '',
    workspaceId: null,
  },
}

export default billingModule
