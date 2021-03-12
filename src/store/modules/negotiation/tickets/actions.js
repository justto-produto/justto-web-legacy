import { axiosDispatch, buildQuery } from '@/utils/'

const disputeApi = '/api/disputes/v2'

const getCorrespondingTab = disputeStatus => {
  switch (disputeStatus) {
    case 'PRE_NEGOTIATION':
      return 'pre-negotiation'
    case 'IMPORTED':
    case 'ENRICHED':
    case 'ENGAGEMENT':
    case 'PENDING':
      return 'engagement'
    case 'RUNNING':
      return 'running'
    case 'ACCEPTED':
    case 'CHECKOUT':
      return 'accepted'
    case 'UNSETTLED':
    case '':
      return 'finished'
    default:
      return 'engagement'
  }
}

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

  setTicketPrescription({ commit }, prescription) {
    commit('setTicketPrescription', prescription)
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

  updateActiveTab({ state, commit }, disputeStatus) {
    const correspondingTab = getCorrespondingTab(disputeStatus)
    if (correspondingTab !== state.ticketsActiveTab) {
      commit('setActiveTab', getCorrespondingTab(disputeStatus))
    }
  },

  SOCKET_ADD_DISPUTE({ rootState, state, commit }, dispute) {
    const correspondingTab = getCorrespondingTab(dispute.status)

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
