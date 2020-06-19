import axiosDispatcher from '@/store/axiosDispatcher.js'
import { queryBuilder } from '@/utils/jusUtils'

const actions = {
  getCusomers: () => {
    axiosDispatcher({
      url: 'api/billing/customer/my',
      mutation: 'setCustomers',
    })
  },
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

  setCustomer: ({ commit, dispatch }) => {
    commit('setCustomer')
    dispatch('getTransactions')
  },
  setRangeDate: ({ commit, dispatch }, rangeDate) => {
    commit('setStartDate', rangeDate[0])
    commit('setFinishDate', rangeDate[1])
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
    dispatch('getTransactions')
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
