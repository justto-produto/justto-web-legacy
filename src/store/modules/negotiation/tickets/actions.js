import { axiosDispatch, buildQuery } from '@/utils/'

const ticketsApi = '/api/disputes/v2'

const overviewActions = {
  getTickets({ state }) {
    return axiosDispatch({
      url: `${ticketsApi}/filter${buildQuery(state.ticketsQuery)}`,
      mutation: 'setCommunicationTickets'
      // mutation: tab ? 'setEngagementTickets' : 'setCommunicationsTickets'
    })
  },
  setTicketsQuery({ commit }, params) {
    commit('setTicketsQuery', params)
  }
}

export default overviewActions
