import { axiosDispatch, buildQuery } from '@/utils/'

const disputeApi = '/api/disputes/v2'
const disputeApiLegacy = '/api/disputes'

const overviewActions = {
  getTickets({ state }) {
    return axiosDispatch({
      url: `${disputeApi}/filter${buildQuery(state.ticketsQuery)}`,
      mutation: 'setCommunicationTickets'
    })
  },

  getTicketsNextPage({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('addTicketQueryPage')
      dispatch('getTickets')
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
