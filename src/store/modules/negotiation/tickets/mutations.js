import Vue from 'vue'
import TicketCommunicationItem from '@/models/negotiations/tickets/TicketCommunicationItemVm'
import TicketEngagementItem from '@/models/negotiations/tickets/TicketEngagementItemVm'

const getTicketIndex = (tickets, disputeId) => tickets.findIndex(ticket => ticket.disputeId === disputeId)

const ticketsMutations = {
  setCommunicationTickets: (state, { data, payload }) => {
    if (payload === 'nextPage') data.content = state.tickets.content.concat(data.content)
    Vue.set(state, 'tickets', data)
  },

  deleteTicket: ({ tickets }, { payload }) => {
    const ticketIndex = getTicketIndex(tickets.content, payload)
    if (ticketIndex > -1) Vue.delete(tickets.content, ticketIndex)
  },

  setTicketsQuery: ({ ticketsQuery }, { key, value }) => Vue.set(ticketsQuery, key, value),

  addTicketQueryPage: ({ ticketsQuery }) => (ticketsQuery.page += 1),

  addTicketPrescription: ({ ticketsQuery }, prescription) => {
    const index = ticketsQuery.prescriptions.length
    Vue.set(ticketsQuery.prescriptions, index, prescription)
  },

  unsetTicketPrescription: ({ ticketsQuery }, prescription) => {
    const index = ticketsQuery.prescriptions.indexOf(prescription)
    Vue.delete(ticketsQuery.prescriptions, index)
  },

  setTicketsFilters: (state, filters) => {
    const { ticketsQuery } = state
    Vue.set(state, 'ticketsQuery', filters)
    Vue.set(ticketsQuery, 'page', 1)
  },

  setActiveTab: (state, activeTab) => Vue.set(state, 'ticketsActiveTab', activeTab),

  updateTicketItem: ({ tickets }, dispute) => {
    const ticketIndex = getTicketIndex(tickets.content, dispute.id)
    const newTicket = [
      'PRE_NEGOTIATION',
      'IMPORTED',
      'ENRICHED',
      'ENGAGEMENT',
      'PENDING'
    ].includes(dispute.status)
      ? new TicketEngagementItem(dispute)
      : new TicketCommunicationItem(dispute)

    if (tickets.empty !== undefined) {
      if (ticketIndex > -1) Vue.set(tickets.content, ticketIndex, newTicket)
      else tickets.content.unshift(newTicket)
    }
  }
}

export default ticketsMutations
