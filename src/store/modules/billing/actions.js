import axiosDispatcher from '@/store/axiosDispatcher'
import moment from 'moment'
import { buildQuery } from '@/utils/jusUtils'

const billingPath = 'api/billing'

const billingActions = {
  getMyCusomers: () => {
    axiosDispatcher({
      url: `${billingPath}/customer/my`,
      mutation: 'setMyCustomers'
    })
  },

  getAllCustomers: () =>
    axiosDispatcher({
      url: `${billingPath}/customer/?size=${9999}`,
      mutation: 'setAllCustomers'
    }),

  associateCustomer: ({ dispatch, state }, customerId) =>
    axiosDispatcher({
      url: `${billingPath}/customer/${customerId}/${state.query.workspaceId}`,
      method: 'patch'
    }).then(() => dispatch('getMyCusomers')),

  addCustomer: ({ dispatch }, customerData) =>
    axiosDispatcher({
      url: `${billingPath}/customer`,
      method: 'post',
      data: customerData
    }).then(res => dispatch('associateCustomer', res.id)),

  unlinkCustomer: ({ dispatch, state }, customerId) =>
    axiosDispatcher({
      url: `${billingPath}/customer/${customerId}/${state.query.workspaceId}`,
      method: 'delete'
    }).then(() => dispatch('getMyCusomers')),

  updateCustomer: ({ dispatch }, customerData) =>
    axiosDispatcher({
      url: `${billingPath}/customer/${customerData.id}`,
      method: 'patch',
      data: customerData
    }).then(() => dispatch('getMyCusomers')),

  getContracts: ({ state }) => {
    axiosDispatcher({
      url: `${billingPath}/customer/${state.currentCustomer.customerId}/contract`,
      mutation: 'setContracts'
    })
  },

  addContract: ({ dispatch, state }, { customerId, contract }) =>
    axiosDispatcher({
      url: `${billingPath}/customer/${customerId}/contract`,
      method: 'post',
      data: {
        invoiceClosingDay: contract.invoiceClosingDay,
        invoiceDueDays: contract.invoiceDueDays,
        monthlySubscriptionFee: contract.monthlySubscriptionFee,
        planId: contract.planId,
        startedDate: contract.startedDate,
        status: contract.status,
        tariffs: contract.tariffs,
        workspaceId: contract.workspaceId
      }
    }).then(() => dispatch('getContracts')),

  updateContract: ({ dispatch }, { customerId, contract }) =>
    axiosDispatcher({
      url: `${billingPath}/customer/${customerId}/contract/${contract.id}`,
      method: 'patch',
      data: {
        invoiceClosingDay: contract.invoiceClosingDay,
        invoiceDueDays: contract.invoiceDueDays,
        monthlySubscriptionFee: contract.monthlySubscriptionFee,
        planId: contract.planId,
        startedDate: contract.startedDate,
        status: contract.status,
        tariffs: contract.tariffs
      }
    }).then(() => dispatch('getMyCusomers')),

  getPlans: () => axiosDispatcher({
    url: `${billingPath}/plans`,
    mutation: 'setPlans'
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
      customerId: state.currentCustomer.customerId
    }

    return axiosDispatcher({
      url: `${billingPath}/transaction${buildQuery(query)}`,
      mutation: command ? 'pushTransactions' : 'setTransactions'
    }).finally(() => {
      commit('setTableLoading', false)
    })
  },

  getBillingDashboard: ({ state }) => {
    const query = {
      ...state.query,
      customerId: state.currentCustomer.customerId
    }

    return axiosDispatcher({
      url: `${billingPath}/dashboard${buildQuery(query)}`,
      mutation: 'setBillingDashboard'
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
      url: `${billingPath}/transaction`,
      method: 'POST',
      data: {
        ...params,
        customerId: state.currentCustomer.customerId
      }
    }).then(() => {
      dispatch('getBillingDashboard')
      const isAfter = moment(params.occurredDate).isAfter(state.query.startDate)
      const isBefore = moment(params.occurredDate).isBefore(state.query.endDate)
      const isSame = moment(params.occurredDate).isSame(state.query.startDate || state.query.endDate)
      if (state.query.type === 'MANUAL' && ((isBefore && isAfter) || isSame)) dispatch('getTransactions')
    })
  },

  patchTransaction: ({ dispatch }, transaction) => {
    return axiosDispatcher({
      url: `${billingPath}/transaction/manual/${transaction.id}`,
      method: 'PATCH',
      data: transaction
    }).then(() => {
      dispatch('getTransactions')
      dispatch('getBillingDashboard')
    })
  },

  cancelTransaction: ({ dispatch }, params) => {
    return axiosDispatcher({
      url: `${billingPath}/transaction/${params.id}/cancel`,
      method: 'POST',
      data: params.data
    }).then(() => {
      dispatch('getBillingDashboard')
      dispatch('getTransactions')
    })
  }
}

export default billingActions
