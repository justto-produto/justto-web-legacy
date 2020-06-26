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
      url: 'api/billing/customer',
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

  addContract: ({ dispatch }, { customerId, contract }) =>
    axiosDispatcher({
      url: `api/billing/customer/${customerId}/contract`,
      method: 'post',
      data: contract,
    }).then(() => dispatch('getMyCusomers')),

  updateContract: ({ dispatch }, { customerId, contract }) =>
    axiosDispatcher({
      url: `api/billing/customer/${customerId}/contract/${contract.id}`,
      method: 'patch',
      data: contract,
    }).then(() => dispatch('getMyCusomers')),

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
    })
  },

  cancelTransaction: ({ dispatch }, params) => {
    axiosDispatcher({
      url: `api/billing/transaction/${params.id}/cancel`,
      method: 'POST',
      data: params.data,
    }).then(() => {
      dispatch('getTransactions')
    })
  },
}

export default actions
