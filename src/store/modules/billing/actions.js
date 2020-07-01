import axiosDispatcher from '@/store/axiosDispatcher.js'
import { queryBuilder } from '@/utils/jusUtils'

const actions = {
  getMyCusomers: () => {
    axiosDispatcher({
      url: 'api/billing/customer/my',
      mutation: 'setMyCustomers',
    })
  },

  getAllCustomers: () =>
    axiosDispatcher({
      url: `api/billing/customer/?size=${9999}`,
      mutation: 'setAllCustomers',
    }),

  associateCustomer: ({ dispatch, state }, customerId) =>
    axiosDispatcher({
      url: `api/billing/customer/${customerId}/${state.query.workspaceId}`,
      method: 'patch',
    }).then(() => dispatch('getMyCusomers')),

  addCustomer: ({ dispatch }, customerData) =>
    axiosDispatcher({
      url: 'api/billing/customer',
      method: 'post',
      data: customerData,
    }).then(res => dispatch('associateCustomer', res.id)),

  unlinkCustomer: ({ dispatch, state }, customerId) =>
    axiosDispatcher({
      url: `api/billing/customer/${customerId}/${state.query.workspaceId}`,
      method: 'delete',
    }).then(() => dispatch('getMyCusomers')),

  updateCustomer: ({ dispatch }, customerData) =>
    axiosDispatcher({
      url: `api/billing/customer/${customerData.id}`,
      method: 'patch',
      data: customerData,
    }).then(() => dispatch('getMyCusomers')),

  getContracts: ({ state }) => {
    axiosDispatcher({
      url: `api/billing/customer/${state.currentCustomer.customerId}/contract`,
      mutation: 'setContracts',
    })
  },

  addContract: ({ dispatch, state }, { customerId, contract }) =>
    axiosDispatcher({
      url: `api/billing/customer/${customerId}/contract`,
      method: 'post',
      data: {
        invoiceClosingDay: contract.invoiceClosingDay,
        invoiceDueDays: contract.invoiceDueDays,
        monthlySubscriptionFee: contract.monthlySubscriptionFee,
        planId: contract.planId,
        startedDate: contract.startedDate,
        status: contract.status,
        tariffs: contract.tariffs,
        workspaceId: state.query.workspaceId,
      },
    }).then(() => dispatch('getMyCusomers')),

  updateContract: ({ dispatch }, { customerId, contract }) =>
    axiosDispatcher({
      url: `api/billing/customer/${customerId}/contract/${contract.id}`,
      method: 'patch',
      data: contract,
    }).then(() => dispatch('getMyCusomers')),

  getPlans: () => axiosDispatcher({
    url: 'api/billing/plans',
    method: 'get',
    mutation: 'setPlans',
  }),

  getTransactions: ({ commit, state }, command) => {
    if (command) {
      commit('addTransactionsQueryPage')
    } else {
      commit('resetTransactionsQueryPage')
      commit('setTableLoading', true)
    }
    const query = {
      ...state.query,
      customerId: state.currentCustomer.customerId,
    }

    return axiosDispatcher({
      url: `api/billing/transaction${queryBuilder(query)}`,
      mutation: command ? 'pushTransactions' : 'setTransactions',
    }).finally(() => {
      commit('setTableLoading', false)
    })
  },

  getBillingDashboard: ({ state }) => {
    const query = {
      ...state.query,
      customerId: state.currentCustomer.customerId,
    }

    return axiosDispatcher({
      url: `api/billing/dashboard${queryBuilder(query)}`,
      mutation: 'setBillingDashboard',
    })
  },

  setCustomer: ({ commit }, customerData) => {
    commit('setCustomer', customerData)
  },
  setCustomerId: ({ commit }, customerId) => {
    commit('setCustomerId', customerId)
  },

  setRangeDate: ({ commit, dispatch }, rangeDate) => {
    commit('setStartDate', rangeDate[0])
    commit('setFinishDate', rangeDate[1])
    dispatch('getBillingDashboard')
    dispatch('getTransactions')
  },
  setTerm: ({ commit, dispatch }, term) => {
    commit('setTerm', term)
    dispatch('getTransactions')
  },
  setType: ({ commit, dispatch }, type) => {
    commit('setType', type)
    dispatch('getTransactions')
  },
  setWorkspaceId: ({ commit }, workspaceId) => {
    commit('setWorkspaceId', workspaceId)
  },
  clearTransactionsQuery: ({ commit }, rangeDate) => {
    commit('setTerm', '')
    commit('setType', '')
    commit('setStartDate', rangeDate[0])
    commit('setFinishDate', rangeDate[1])
    commit('setTransactions', {})
  },

  postTransaction: ({ state, dispatch }, params) => {
    axiosDispatcher({
      url: '/api/billing/transaction',
      method: 'POST',
      data: {
        ...params,
        customerId: state.currentCustomer.customerId,
      },
    }).then(() => {
      dispatch('getTransactions')
      dispatch('getBillingDashboard')
    })
  },

  patchTransaction: ({ dispatch }, transaction) => {
    return axiosDispatcher({
      url: `api/billing/transaction/manual/${transaction.id}`,
      method: 'PATCH',
      data: transaction,
    }).then(() => {
      dispatch('getTransactions')
      dispatch('getBillingDashboard')
    })
  },

  cancelTransaction: ({ dispatch }, params) => {
    return axiosDispatcher({
      url: `api/billing/transaction/${params.id}/cancel`,
      method: 'POST',
      data: params.data,
    }).then(() => {
      dispatch('getTransactions')
      dispatch('getBillingDashboard')
    })
  },
}

export default actions
