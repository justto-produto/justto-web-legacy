const getters = {
  getCusomers: state => state.customers,
  getCurrentCustomer: state => state.currentCustomer,
  transactions: state => state.currentCustomer.transactions,
  billingDashboard: state => {
    return [
      {
        title: 'imports',
        total: state.billingDashboard.importsTotal,
        revenue: state.billingDashboard.importsRevenue,
      },
      {
        title: 'dealsSettled',
        total: state.billingDashboard.dealsSettledTotal,
        revenue: state.billingDashboard.dealsSettledRevenue,
      },
      {
        title: 'monthlyFees',
        total: state.billingDashboard.monthlyFeesTotal,
        revenue: state.billingDashboard.monthlyFeesRevenue,
      },
      {
        title: 'interactions',
        total: state.billingDashboard.interactionsTotal,
        revenue: state.billingDashboard.interactionsRevenue,
      },
      {
        title: 'dealsAccepted',
        total: state.billingDashboard.dealsAcceptedTotal,
        revenue: state.billingDashboard.dealsAcceptedRevenue,
      },
      {
        title: 'others',
        total: state.billingDashboard.othersTotal,
        revenue: state.billingDashboard.othersRevenue,
      },
      {
        title: 'overall',
        revenue: state.billingDashboard.overallRevenue,
      },
    ]
  },
}

export default getters
