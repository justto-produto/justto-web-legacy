import { axiosDispatch, buildQuery } from '@/utils/'

const disputeApi = '/api/disputes/v2'
const disputeApiLegacy = '/api/disputes'

const overviewActions = {
  getTickets({ state }, command) {
    return axiosDispatch({
      url: `${disputeApi}/filter${buildQuery(state.ticketsQuery)}`,
      mutation: 'setCommunicationTickets',
      payload: command || 'firstPage'
    })
  },

  getTicketsNextPage({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('addTicketQueryPage')
      dispatch('getTickets', 'nextPage')
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },

  deleteTicket({ _ }, params) {
    const { disputeId, reason } = params

    return axiosDispatch({
      url: `${disputeApiLegacy}/${disputeId}/${reason}`,
      method: 'DELETE',
      mutation: 'deleteTicket',
      payload: disputeId
    })
  },

  setTicketsQuery({ commit }, params) {
    commit('setTicketsQuery', params)
  },

  addTicketPrescription({ commit }, prescription) {
    commit('addTicketPrescription', prescription)
  },

  removeTicketPrescription({ commit }, prescription) {
    commit('removeTicketPrescription', prescription)
  }
}

export default overviewActions
