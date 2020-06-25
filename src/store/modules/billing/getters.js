const getters = {
  getAllCusomers: state => state.allCustomers,
  getMyCusomers: state => state.myCustomers,
  getCurrentCustomer: state => state.currentCustomer,
  transactions: state => state.currentCustomer.transactions,
  billingDashboard: state => state.billingDashboard,
  tableLoading: state => state.tableLoading,
}

export default getters
