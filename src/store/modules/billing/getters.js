const getters = {
  getCusomers: state => state.customers,
  getCurrentCustomer: state => state.currentCustomer,
  transactions: state => state.currentCustomer.transactions,
  billingDashboard: state => state.billingDashboard,
}

export default getters
