import { axiosDispatch, buildQuery } from '@/utils/'

const ticketsApi = '/api/disputes/v2'

const overviewActions = {
  getTickets({ state }, command) {
    return axiosDispatch({
      url: `${ticketsApi}/filter${buildQuery(state.ticketsQuery)}`,
      mutation: command === 'nextPage' ? 'setCommunicationTicketsNextPage' : 'setCommunicationTickets'
    })
  },

  setTicketsQuery({ commit }, params) {
    commit('setTicketsQuery', params)
  },

  getTicketsNextPage({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('addTicketQueryPage')
      dispatch('getTickets', 'nextPage')
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },

  addTicketPrescription({ commit }, prescription) {
    commit('addTicketPrescription', prescription)
  },

  removeTicketPrescription({ commit }, prescription) {
    commit('removeTicketPrescription', prescription)
  },

  resetTicketsPage({ commit }) {
    commit('setTicketsQuery', { key: 'page', value: 0 })
  }
}

export default overviewActions
