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
  }
}

export default overviewActions
