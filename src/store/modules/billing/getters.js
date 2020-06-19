const getters = {
  getCusomers: state => state.customers,
  getCurrentCustomer: state => state.currentCustomer,
  transactions: state => state.currentCustomer.transactions,
}

export default getters
