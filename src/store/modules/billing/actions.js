import axiosDispatcher from '@/store/axiosDispatcher.js'
import { queryBuilder } from '@/utils/jusUtils'

const actions = {
  getCusomers: () =>
    axiosDispatcher({
      url: 'api/billing/customer/my',
      mutation: 'setCustomers',
    }),
  getContracts: ({ state }) =>
    axiosDispatcher({
      url: `api/billing/customer/${state.currentCustomer.customerId}/contract`,
      mutation: 'setContracts',
    }),
  getDashboardData: ({ state }) => {
    const query = {
      startDate: state.startDate,
      finishDate: state.finishDate,
      customerId: state.currentCustomer.customerId,
      workspaceId: state.workspaceId,
    }

    return axiosDispatcher({
      url: `api/billing/dashboard${queryBuilder(query)}`,
      mutation: 'setDashboardData',
    })
  },
  setCustomer: ({ commit, dispatch }) => commit('setCustomer')
    .then(_res => dispatch('getDashboardData')),
  setStartDate: ({ commit, dispatch }, newDate) => commit('setStartDate', newDate)
    .then(_res => dispatch('getDashboardData')),
  setFinishDate: ({ commit, dispatch }, newDate) => commit('setFinishDate', newDate)
    .then(_res => dispatch('getDashboardData')),
  setWorkspace: ({ commit, dispatch }, workspaceId) => commit('setWorkspace', workspaceId)
    .then(_res => dispatch('getCusomers')),
}

export default actions
