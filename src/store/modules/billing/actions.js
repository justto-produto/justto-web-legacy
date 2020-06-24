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
  getTransactions: ({ state }) => {
    const query = {
      ...state.query,
      customerId: state.currentCustomer.customerId,
    }

    return axiosDispatcher({
      url: `api/billing/transaction${queryBuilder(query)}`,
      mutation: 'setTransactions',
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

  setCustomer: ({ commit, dispatch }, customerData) => {
    if (!customerData.contracts.length) customerData.contracts.push({})
    commit('setCustomer', customerData)
    dispatch('getTransactions')
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
  clearTransactionsQuery: ({ commit, dispatch }, rangeDate) => {
    commit('setTerm', '')
    commit('setType', '')
    commit('setStartDate', rangeDate[0])
    commit('setFinishDate', rangeDate[1])
    commit('setTransactions', [])
    dispatch('getBillingDashboard')
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
