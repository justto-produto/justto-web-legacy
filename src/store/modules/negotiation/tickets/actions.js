import { axiosDispatch, buildQuery } from '@/utils/'

const disputeApi = '/api/disputes/v2'

const overviewActions = {
  getTickets({ state, dispatch }, command) {
    if (command !== 'nextPage') dispatch('setTicketsQuery', { key: 'page', value: 1 })
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

  setTicketsQuery({ commit }, params) {
    commit('setTicketsQuery', params)
  },

  addTicketPrescription({ commit }, prescription) {
    commit('addTicketPrescription', prescription)
  },

  unsetTicketPrescription({ commit }, prescription) {
    commit('unsetTicketPrescription', prescription)
  },

  setTicketsFilters({ commit }, filters) {
    commit('setTicketsFilters', filters)
  },

  setActivTab({ commit }, activeTab) {
    commit('setActiveTab', activeTab)
  },

  SOCKET_ADD_DISPUTE({ rootState, state, commit }, dispute) {
    let correspondingTab
    switch (dispute.status) {
      case 'PRE_NEGOTIATION':
        correspondingTab = 'pre-negotiation'
        break
      case 'IMPORTED':
      case 'ENRICHED':
      case 'ENGAGEMENT':
      case 'PENDING':
        correspondingTab = 'engagement'
        break
      case 'RUNNING':
        correspondingTab = 'running'
        break
      case 'ACCEPTED':
      case 'CHECKOUT':
        correspondingTab = 'accepted'
        break
      case '':
        correspondingTab = 'finished'
        break
    }

    if (rootState.negotiationOverviewModule.ticketOverview.disputeId === dispute.id) {
      if (correspondingTab !== state.ticketsActiveTab) {
        commit('setActiveTab', correspondingTab)
      } else {
        commit('updateTicketItem', dispute)
      }
      commit('updateTicket', dispute)
    } else {
      if (correspondingTab !== state.ticketsActiveTab) {
        commit('deleteTicket', dispute.id)
      } else {
        commit('updateTicketItem', dispute)
      }
    }
  },

  SOCKET_REMOVE_DISPUTE({ commit }, dispute) {
    commit('deleteTicket', dispute.id)
  }
}

export default overviewActions
